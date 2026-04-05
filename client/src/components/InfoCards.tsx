import { INFO_CARDS } from "@/lib/constants";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function InfoCards() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {INFO_CARDS.map((card) => (
            <div 
              key={card.id} 
              className={`rounded-xl overflow-hidden ${!card.image ? card.color : ''} shadow-md h-96`}
            >
              {card.image ? (
                
                <div className="relative h-full">
                  <div 
                    className="absolute inset-0 bg-cover bg-center" 
                    style={{ backgroundImage: `url('${card.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-black/60" />
                  <div className="relative px-8 py-10 h-full flex flex-col justify-end font-medium z-10">
                    {card.title && <h3 className="text-xl text-white mb-2">{card.title}</h3>}
                    <div>
                      <p className="text-lg text-white font-light mb-6">{card.content}</p>
                      <Link href={card.link}>
                        <Button className="rounded-full bg-white text-black hover:bg-gray-100">
                          {card.linkText}
                        </Button>
                      </Link>
                    </div>
                  </div>
                  {card.services && (
  <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-3 space-y-2">
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      Service Times
    </p>

    {card.services.map((service, index) => (
      <div key={index} className="flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-gray-800">
          {service.day}
        </span>
        <span className="text-sm font-semibold text-black">
          {service.time}
        </span>
      </div>
    ))}
  </div>
)}
                </div>
              ) : (
                <div className="px-8 py-10 h-full flex flex-col justify-end">
                  {card.title && <h3 className="text-xl font-bold mb-2">{card.title}</h3>}
                  <div>
                    <p className="text-lg font-light mb-6">{card.content}</p>
                    <Link href={card.link}>
                      <Button className="rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50">
                        {card.linkText}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
