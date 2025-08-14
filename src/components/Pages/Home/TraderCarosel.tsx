// "use client"

// import TraderCard from "./TraderCard"

// interface Trader {
//     avatarSrc: string
//     name: string
//     role: string
//     rating: number
//     reviews: number
//     skills: string[]
//     location: string
//     rate: string
//     jobSuccess: string
// }

// interface TraderCarouselProps {
//     traders: Trader[]
// }

// export default function TraderCarousel({ traders }: TraderCarouselProps) {
//     return (
//         <Carousel
//             opts={{
//                 align: "start",
//             }}
//             className="w-full"
//         >
//             <CarouselContent className="-ml-4 py-4">
//                 {traders.map((trader, index) => (
//                     <CarouselItem
//                         key={index}
//                         className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
//                     >
//                         <TraderCard {...trader} />
//                     </CarouselItem>
//                 ))}
//             </CarouselContent>
//             <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md z-10 h-12 w-12" />
//             <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full shadow-md z-10 h-12 w-12" />
//         </Carousel>
//     )
// }