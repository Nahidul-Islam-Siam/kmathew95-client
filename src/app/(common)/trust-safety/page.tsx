import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Users,
  Eye,
  AlertTriangle,
  MessageSquare,
  Mail,
} from "lucide-react";

export default function TrustSafety() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trust & Safety
          </h1>
          <p className="text-gray-600 mb-4">
            Your safety is our priority. We work hard to create a secure and
            welcoming environment for everyone.
          </p>
        </div>

        {/* Content */}
        <Card>
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Shield className="w-6 h-6 inline mr-2" />
                How We Keep You Safe
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>
                  Advanced security measures protect your account and data
                </li>
                <li>All users are verified to ensure authentic profiles</li>
                <li>24/7 monitoring systems detect suspicious activity</li>
                <li>
                  Clear community guidelines promote respectful interactions
                </li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Users className="w-6 h-6 inline mr-2" />
                Community Guidelines
              </h2>
              <p className="text-gray-700 mb-3">
                To keep our community safe, please:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Be respectful and kind to others</li>
                <li>Don&lsquo;t share personal information publicly</li>
                <li>Report suspicious or harmful behavior</li>
                <li>Use your real identity - no fake profiles</li>
                <li>Don&apos;t spam or send unwanted messages</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <AlertTriangle className="w-6 h-6 inline mr-2" />
                How to Report Issues
              </h2>
              <p className="text-gray-700 mb-3">
                If you see something concerning:
              </p>
              <ol className="list-decimal list-inside text-gray-700 space-y-1">
                <li>Click the &#34;Report&ldquo; button on any content or profile</li>
                <li>Choose the reason for your report</li>
                <li>Our team will review it within 24 hours</li>
                <li>We&rsquo;ll take action and let you know the outcome</li>
              </ol>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <Eye className="w-6 h-6 inline mr-2" />
                What We Monitor
              </h2>
              <p className="text-gray-700 mb-3">
                Our systems automatically watch for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Inappropriate or harmful content</li>
                <li>Spam and fake accounts</li>
                <li>Harassment or bullying</li>
                <li>Suspicious login attempts</li>
                <li>Violations of our community guidelines</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                <MessageSquare className="w-6 h-6 inline mr-2" />
                Safety Tips
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Use a strong, unique password for your account</li>
                <li>Don&lsquo;t share your login details with anyone</li>
                <li>Be cautious about meeting people from online in person</li>
                <li>
                  Trust your instincts - if something feels wrong, report it
                </li>
                <li>Keep your personal information private</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Emergency Situations
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-800">
                  <strong>Important:</strong> If you&rsquo;re in immediate danger,
                  contact local emergency services first.
                </p>
              </div>
              <p className="text-gray-700">
                For urgent safety concerns on our platform, use our emergency
                reporting feature or contact our safety team directly.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Contact Our Safety Team
              </h2>
              <p className="text-gray-700 mb-4">
                Have questions about safety or need to report something? Our
                team is here to help.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">Safety Team</p>
                  <p className="text-gray-600">safety@company.com</p>
                </div>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
