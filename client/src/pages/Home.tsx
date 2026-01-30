import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import InfoCards from "@/components/InfoCards";
import Locations from "@/components/Locations";
import Activate from "@/components/Activate";
import AppDownload from "@/components/AppDownload";
import UpcomingEvents from "@/components/UpcomingEvents";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Message } from "@shared/schema";

export default function Home() {
  useEffect(() => {
    document.title = "Sanctuary of Hope Church - Home";
  }, []);

  const {
    data: latestMessage,
    isLoading: messageLoading,
    error: messageError
  } = useQuery<Message>({
    queryKey: ['/api/latest-message'],
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow">
        {/* Hero Section with QuickActions */}
        <section className="w-full bg-gray-50 pt-8 pb-12">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row">
              {/* Hero component */}
              <div className="w-full lg:w-3/5 lg:pr-8 mb-8 lg:mb-0">
                {messageLoading ? (
                  <div className="relative overflow-hidden rounded-xl aspect-[16/9] bg-gray-200 animate-pulse shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gray-400">Loading...</div>
                    </div>
                  </div>
                ) : messageError ? (
                  <div className="relative overflow-hidden rounded-xl aspect-[16/9] bg-red-100 shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-red-500">Error loading latest message</div>
                    </div>
                  </div>
                ) : latestMessage ? (
                  <div
                    className="relative overflow-hidden rounded-xl aspect-[16/9] bg-black shadow-lg"
                  >
                    {latestMessage.video_url ? (
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${latestMessage.video_url.split('v=')[1]}?autoplay=1&mute=1&controls=0&loop=1&playlist=${latestMessage.video_url.split('v=')[1]}`}
                        title="Latest Message Video"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                        style={{
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${latestMessage.image || "https://images.unsplash.com/photo-1493804714600-6edb1cd93080?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"}')`,
                        }}
                      />
                    )}

                    <div className="absolute inset-0 flex items-end justify-start p-6 md:p-10 z-10">
                      <div className="text-white font-bold">
                        <p className="uppercase tracking-wider text-xs mb-1">LATEST MESSAGE</p>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl mb-2">{latestMessage.title}</h1>
                        <p className="mb-6 text-sm md:text-base">{latestMessage.speaker} | {latestMessage.date}</p>

                        <a
                          href={latestMessage.video_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center bg-white hover:bg-gray-100 text-gray-900 rounded-full px-5 py-2 shadow-md font-semibold ring-2 ring-blue-400 ring-offset-2 hover:ring-blue-500 hover:shadow-blue-300"
                        >
                          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Watch Now
                        </a>


                      </div>
                    </div>

                  </div>

                ) : (
                  <div className="relative overflow-hidden rounded-xl aspect-[16/9] bg-gray-100 shadow-lg">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-gray-500">No messages available</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <QuickActions />
            </div>
          </div>
        </section>

        <InfoCards />
        <Locations />
        <Activate />
        {/* <AppDownload /> */}
        <UpcomingEvents />
      </main>
      <Footer />
    </div>
  );
}
