import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import React from "react";

/**
 * External API event shape
 */
interface ExternalEvent {
  id: number;
  slug: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  registration_url?: string;
}

/**
 * UI-ready event shape
 */
interface EventDisplay {
  id: string;
  title: string;
  date: string;
  month: string;
  day: string;
  time: string;
  image: string;
  link: string;
}

function transformEvents(events: ExternalEvent[]): EventDisplay[] {
  return events.map(event => {
    let month = "";
    let day = "";

    try {
      const dateObj = new Date(event.date);
      if (!isNaN(dateObj.getTime())) {
        month = dateObj.toLocaleString("default", { month: "short" });
        day = dateObj.getDate().toString();
      } else {
        const parts = event.date.split(/[,\s-]+/);
        month = parts[0]?.substring(0, 3) ?? "";
        day = parts[1] ?? "";
      }
    } catch {
      const parts = event.date.split(/[\s,.-]+/);
      month = parts[0]?.substring(0, 3) ?? "";
      day = parts[1] ?? "";
    }

    return {
      id: event.id.toString(),
      title: event.title,
      date: event.date,
      month,
      day,
      time: event.time,
      image: event.image,
      link: event.registration_url || `/events/${event.slug}`,
    };
  });
}

export default function UpcomingEvents() {
  const upcomingQuery = useQuery<ExternalEvent[]>({
    queryKey: ["/api/events/upcoming"],
  });

  const shouldLoadPastEvents =
    upcomingQuery.isSuccess && upcomingQuery.data.length === 0;

  const pastEventsQuery = useQuery<ExternalEvent[]>({
    queryKey: ["/api/events", { limit: 4 }],
    enabled: shouldLoadPastEvents,
  });

  const isLoading =
    upcomingQuery.isLoading ||
    (shouldLoadPastEvents && pastEventsQuery.isLoading);

  const error = upcomingQuery.error || pastEventsQuery.error;

  const { events, title } = React.useMemo(() => {
    if (shouldLoadPastEvents && pastEventsQuery.data) {
      return {
        title: "Past Events",
        events: transformEvents(pastEventsQuery.data),
      };
    }

    if (upcomingQuery.data) {
      return {
        title: "Upcoming Events",
        events: transformEvents(upcomingQuery.data),
      };
    }

    return { title: "Upcoming Events", events: [] };
  }, [shouldLoadPastEvents, upcomingQuery.data, pastEventsQuery.data]);

  return (
    <section className="container mx-auto px-4 my-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-lg text-gray-500">
          Join us for these special events and gatherings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse"
            >
              <div className="w-full h-40 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-4 text-center text-red-500">
            Failed to load events.
          </div>
        ) : (
          events.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100"
            >
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover"
              />

              <div className="p-4">
                <div className="flex items-start mb-3">
                  <div className="bg-gray-50 rounded p-2 mr-3 text-center">
                    <span className="block text-sm font-bold">{event.month}</span>
                    <span className="block text-xl font-bold">{event.day}</span>
                  </div>

                  <div>
                    <h3 className="font-bold">{event.title}</h3>
                    <p className="text-sm text-gray-500">{event.time}</p>
                  </div>
                </div>

                {event.link.startsWith("http") ? (
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 text-sm font-medium"
                  >
                    Learn More
                  </a>
                ) : (
                  <Link href={event.link}>
                    <span className="text-blue-500 text-sm font-medium cursor-pointer">
                      Learn More
                    </span>
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center mt-8">
        <Link href="/events">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6 py-6">
            View All Events
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}