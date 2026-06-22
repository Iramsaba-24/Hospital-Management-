type VisitType = "OPD" | "IPD";

interface TimelineEntry {
  id: number;
  type: VisitType;
  title: string;
  date: string;
  subtitle: string;
  amount: number;
}

const timeline: TimelineEntry[] = [
  {
    id: 1,
    type: "OPD",
    title: "OPD Visit",
    date: "12 Feb 2026",
    subtitle: "Dr. Amit Singh • Viral Fever",
    amount: 850,
  },
  {
    id: 2,
    type: "IPD",
    title: "IPD Admission",
    date: "05 Jan 2026",
    subtitle: "Dengue • 4 Days Stay • General Ward",
    amount: 24500,
  },
  {
    id: 3,
    type: "OPD",
    title: "OPD Visit",
    date: "10 Dec 2025",
    subtitle: "Hypertension Follow-up",
    amount: 600,
  },
];

const dotColor = {
  OPD: "bg-blue-500",
  IPD: "bg-green-500",
};

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

export default function Overview() {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-3 bottom-3 w-px bg-gray-200" />

      <div className="space-y-3">
        {timeline.map((item) => (
          <div key={item.id} className="relative">
            <span
              className={`absolute -left-8 top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full border-2 border-white shadow ${dotColor[item.type]}`}
            />

            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 hover:shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-gray-800">
                  {item.title}
                  <span className="ml-1 font-normal text-gray-500">
                    • {item.date}
                  </span>
                </h3>

                <p className="mt-1 text-xs text-gray-500">
                  {item.subtitle}
                </p>
              </div>

              <span className="ml-4 text-sm font-semibold text-gray-700">
                {currency.format(item.amount)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}