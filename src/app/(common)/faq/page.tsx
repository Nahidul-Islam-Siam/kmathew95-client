import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MessageSquare } from "lucide-react";
import Link from "next/link";

export default function Faq() {
  const faqItems = [
    {
      id: "item-1",
      question: "The expens windows adapted sir. Wrong widen drawn.",
      answer:
        "Offering belonging promotion provision an be oh consulted ourselves it. Blessing welcomed ladyship she met humoured sir breeding her.",
    },
    {
      id: "item-2",
      question: "Six curiosity day assurance bed necessary?",
      answer:
        "Curiosity day assurance bed necessary. You inquietude dwelling acceptance men who. Excellent use acceptance no daughters stuff.",
    },
    {
      id: "item-3",
      question: "Produce say the ten moments parties?",
      answer:
        "Produce say the ten moments parties. Simple innate summer fat appear basket his desire joy. Outward clothes promise at gravity do excited.",
    },
    {
      id: "item-4",
      question: "Simple innate summer fat appear basket his desire joy?",
      answer:
        "Simple innate summer fat appear basket his desire joy. Outward clothes promise at gravity do excited. Sufficient particular impossible by reasonable.",
    },
    {
      id: "item-5",
      question: "Outward clothes promise at gravity do excited?",
      answer:
        "Outward clothes promise at gravity do excited. Sufficient particular impossible by reasonable oh expression is. Yet preference connection unpleasant.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
      <div className="grid lg:grid-cols-3 items-center gap-8 lg:gap-12">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Frequently
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              asked questions
            </h2>
          </div>

          <Accordion
            type="single"
            collapsible
            defaultValue="item-1"
            className="space-y-4"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border border-gray-200 rounded-lg px-6 py-2"
              >
                <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pt-2 pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-gray-50 border-gray-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-blue-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Do you have more questions?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                End-to-end payments and financial management in a single
                solution. Meet the right platform to help realize.
              </p>
              <Link href={"/contactUs"}>
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3">
                  Show a Direct Mail
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
