export default function StatsSection() {
  const stats = [
    { value: "557K", label: "Total Trader" },
    { value: "475K", label: "Positive Review" },
    { value: "25K", label: "Task received" },
    { value: "265K", label: "Task completed" },
  ];

  return (
    <section className="w-full py-8 px-4 md:px-6 bg-[#FCF2EA] font-inter">
      <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center text-center gap-1 transition-all duration-300 hover:scale-105 hover:bg-white/30 rounded-xl p-2 cursor-default"
          >
            <h3 className="text-3xl md:text-4xl font-bold text-[#1C2A47]">
              {stat.value}
            </h3>
            <p className="md:text-[25px] text-xl text-[#1C2A47]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}