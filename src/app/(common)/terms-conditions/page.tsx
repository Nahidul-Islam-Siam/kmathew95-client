import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail } from "lucide-react";

export default function SimpleTerms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-gray-600 mb-4">
            By using our service, you agree to these terms. Please read them
            carefully.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last updated: January 15, 2024</span>
          </div>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2x    l font-semibold text-gray-900 mb-4">
                1. Agreement
              </h2>
              <p className="text-gray-700">
                By using our website and services, you agree to these terms. If
                you don&apos;t agree, please don&apos;t use our service.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. Your Account
              </h2>
              <p className="text-gray-700 mb-3">
                You&apos;re responsible for your account and keeping your
                password safe. You must:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Be at least 18 years old</li>
                <li>Provide accurate information</li>
                <li>Keep your login details secure</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. What You Can&lsquo;t Do
              </h2>
              <p className="text-gray-700 mb-3">
                Don&apos;t use our service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Break any laws</li>
                <li>Harm other users</li>
                <li>Share inappropriate content</li>
                <li>Try to hack or damage our system</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Your Content
              </h2>
              <p className="text-gray-700">
                You own the content you post, but you give us permission to use
                it on our platform. Make sure you have the right to share
                anything you upload.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Payments
              </h2>
              <p className="text-gray-700">
                If you buy something, you agree to pay for it. All sales are
                final unless we say otherwise. We&apos;ll charge your payment
                method right away.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. We Can End This
              </h2>
              <p className="text-gray-700">
                We can stop providing our service to you at any time, especially
                if you break these rules. You can also stop using our service
                whenever you want.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. No Guarantees
              </h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800">
                  <strong>Important:</strong> We provide our service &quot;as
                  is&quot; without any promises that it will work perfectly.
                </p>
              </div>
              <p className="text-gray-700">
                We&apos;re not responsible if something goes wrong or if you
                lose money using our service.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Changes
              </h2>
              <p className="text-gray-700">
                We might change these terms sometimes. If we do, we&apos;ll let
                you know. Keep using our service means you agree to the new
                terms.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Questions?
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these terms, contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Email us</p>
                  <p className="text-gray-600">support@company.com</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
