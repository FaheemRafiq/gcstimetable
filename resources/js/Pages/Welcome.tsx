import { Link, Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import { Calendar, Clock, CheckCircle, ChevronRight, UserPlus } from 'lucide-react';

export default function LandingPage({ auth, appVersion, phpVersion }: PageProps<{ appVersion: string, phpVersion: string }>) {
    return (
        <>
            {/* SEO and Metadata */}
            <Head>
                <title>Timetable Generator - Organize Your Time Effectively</title>
                <meta name="description" content="Timetable Generator is the perfect tool to help you create and manage timetables effortlessly. Maximize your productivity and streamline your schedule today!" />
                <meta name="keywords" content="Timetable Generator, schedule, productivity, time management, app" />
            </Head>

            <div className="bg-gray-50 dark:bg-gray-900 text-black dark:text-gray-100">
                <div className="min-h-screen flex flex-col items-center justify-center text-center p-8">
                    
                    {/* Hero Section */}
                    <header className="flex flex-col items-center justify-center py-12">
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Boost Your Productivity with Timetable Generator</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Create your personalized schedule in minutes. Stay organized, focused, and ahead of your tasks.
                        </p>

                        <div className="flex gap-4">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href={route('register')} className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition">
                                        Get Started
                                    </Link>
                                    <Link href={route('login')} className="px-6 py-3 bg-gray-600 text-white rounded-full text-lg font-semibold shadow hover:bg-gray-700 transition">
                                        Log In
                                    </Link>
                                </>
                            )}
                        </div>
                    </header>

                    {/* Features Section */}
                    <section className="mt-12 w-full max-w-6xl">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Why Choose Timetable Generator?</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                            {/* Feature 1 */}
                            <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-lg dark:bg-gray-800">
                                <Calendar className="h-12 w-12 text-blue-600 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Easy Timetable Creation</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-center">
                                    Effortlessly generate timetables for your week, month, or custom duration with just a few clicks.
                                </p>
                            </div>

                            {/* Feature 2 */}
                            <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-lg dark:bg-gray-800">
                                <Clock className="h-12 w-12 text-blue-600 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-Time Updates</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-center">
                                    Stay updated with real-time changes and notifications, ensuring you never miss a task or appointment.
                                </p>
                            </div>

                            {/* Feature 3 */}
                            <div className="flex flex-col items-center p-6 rounded-lg bg-white shadow-lg dark:bg-gray-800">
                                <CheckCircle className="h-12 w-12 text-blue-600 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Highly Customizable</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-center">
                                    Customize your timetable according to your preferences, with flexible layout options and color schemes.
                                </p>
                            </div>

                        </div>
                    </section>

                    {/* Call to Action Section */}
                    <section className="mt-16 w-full max-w-4xl text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Ready to Organize Your Time?</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                            Join thousands of users who have streamlined their productivity using Timetable Generator. It's free to get started!
                        </p>

                        <Link href={route('register')} className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold shadow hover:bg-blue-700 transition inline-flex items-center">
                            <UserPlus className="mr-2 h-6 w-6" /> Sign Up Now
                        </Link>
                    </section>

                    {/* Footer */}
                    <footer className="mt-24 text-gray-600 dark:text-gray-400 text-sm">
                        <p>© 2024 Timetable Generator. All rights reserved.</p>
                        <p>App version: {appVersion} (PHP v{phpVersion})</p>
                    </footer>
                </div>
            </div>
        </>
    );
}
