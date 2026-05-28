import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FAQItemCard } from '@/components/faq/FAQItemCard';
import type { FAQItem } from '@/components/faq/FAQItemCard';

export const metadata: Metadata = {
  title: 'FAQ | Next.js Starter',
  description: 'Frequently asked questions about Next.js Starter.',
};

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How do I create an account?',
    answer:
      'To create an account, click the "Sign Up" button in the top navigation, fill out the registration form with your details, and verify your email address.',
  },
  {
    id: '2',
    question: 'Is my data secure?',
    answer:
      'Yes, we take data security seriously. We use industry-standard encryption and security measures to protect your personal information and data.',
  },
  {
    id: '3',
    question: 'Can I delete my account?',
    answer:
      'Yes, you can delete your account at any time from your account settings. Please note that this action is irreversible and all your data will be permanently removed.',
  },
  {
    id: '4',
    question: 'How do I reset my password?',
    answer:
      'If you forgot your password, click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email.',
  },
  {
    id: '5',
    question: 'Is there a mobile app available?',
    answer:
      'Currently, our service is web-based and optimized for mobile browsers. We are working on native mobile applications for iOS and Android.',
  },
  {
    id: '6',
    question: 'How can I contact support?',
    answer:
      'You can contact our support team through the contact form on our website, or email us directly at support@example.com. We typically respond within 24 hours.',
  },
  {
    id: '7',
    question: 'What browsers are supported?',
    answer:
      'Our service works best on modern browsers including Chrome, Firefox, Safari, and Edge. We recommend keeping your browser updated for the best experience.',
  },
  {
    id: '8',
    question: 'Can I export my data?',
    answer:
      'Yes, you can export your data at any time from your account settings. We provide exports in common formats like JSON and CSV.',
  },
];

export default function FAQPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find answers to common questions about our service
        </p>
      </div>

      <div className="mt-12">
        <div className="divide-y divide-border">
          {faqData.map(item => (
            <FAQItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-lg bg-muted p-8 text-center">
        <h2 className="text-xl font-semibold">Still have questions?</h2>
        <p className="mt-2 text-muted-foreground">
          Can&apos;t find the answer you&apos;re looking for? Please contact our
          support team.
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
