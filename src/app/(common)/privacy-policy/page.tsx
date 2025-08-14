import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Mail, Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-4">
            We respect your privacy and are committed to protecting your
            personal data. This policy explains how we collect, use, and
            safeguard your information.
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
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 mb-3">
                We collect information you provide directly to us, such as when
                you:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Create an account or profile</li>
                <li>Make a purchase or transaction</li>
                <li>Contact us for support</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in surveys or promotions</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="text-gray-700 mb-3">
                We use the information we collect to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Provide and improve our services</li>
                <li>Process transactions and send confirmations</li>
                <li>Send you updates and marketing communications</li>
                <li>Respond to your questions and provide support</li>
                <li>Protect against fraud and abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                3. Information Sharing
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800">
                  <strong>We don&lsquo;t sell your personal information.</strong> We
                  only share it in specific circumstances outlined below.
                </p>
              </div>
              <p className="text-gray-700 mb-3">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Service providers who help us operate our business</li>
                <li>Law enforcement when required by law</li>
                <li>Other parties with your explicit consent</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                4. Cookies and Tracking
              </h2>
              <p className="text-gray-700 mb-3">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our website</li>
                <li>Provide personalized content and ads</li>
                <li>Improve our services and user experience</li>
              </ul>
              <p className="text-gray-700 mt-3">
                You can control cookies through your browser settings, but some
                features may not work properly if you disable them.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                5. Data Security
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-green-800 font-medium">
                    Your data is protected
                  </p>
                  <p className="text-green-700 text-sm">
                    We use industry-standard security measures to protect your
                    information.
                  </p>
                </div>
              </div>
              <p className="text-gray-700">
                We implement appropriate technical and organizational measures
                to protect your personal data against unauthorized access,
                alteration, disclosure, or destruction. However, no method of
                transmission over the internet is 100% secure.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                6. Your Rights
              </h2>
              <p className="text-gray-700 mb-3">
                Depending on your location, you may have the right to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Access the personal data we hold about you</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Delete your personal data</li>
                <li>Restrict or object to data processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                7. Data Retention
              </h2>
              <p className="text-gray-700">
                We keep your personal data only as long as necessary to provide
                our services and fulfill the purposes outlined in this policy.
                When we no longer need your data, we securely delete or
                anonymize it.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                8. Children&apos;s Privacy
              </h2>
              <p className="text-gray-700">
                Our services are not intended for children under 13. We don&apos;t
                knowingly collect personal information from children under 13.
                If you believe we have collected such information, please
                contact us immediately.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                9. Changes to This Policy
              </h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We&apos;ll
                notify you of any material changes by posting the new policy on
                this page and updating the &#34;last updated&#34; date.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                10. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this privacy policy or how we handle
                your data, contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Privacy Team</p>
                  <p className="text-gray-600">privacy@company.com</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
