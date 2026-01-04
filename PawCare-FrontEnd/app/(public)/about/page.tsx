import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
	return (
		<main className="min-h-screen bg-[#0f4f57] text-white">
			<section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
				<div className="grid md:grid-cols-2 gap-12 items-center">
					<div className="space-y-5">
						<p className="uppercase tracking-[0.2em] text-xs text-[#f8d548]">About PawCare</p>
						<h1 className="text-4xl md:text-5xl font-bold leading-tight">We help every pet live healthier and happier</h1>
						<p className="text-lg text-gray-100/85 leading-relaxed">
							PawCare brings together health tracking, training plans, and expert guidance so you can care for your best friend with confidence. We keep everything organized—records, appointments, and progress—in one friendly place.
						</p>
						<div className="grid grid-cols-2 gap-4 text-sm text-gray-100/85">
							<div className="rounded-2xl bg-white/10 p-4 border border-white/10">
								<p className="text-2xl font-bold text-[#f8d548]">24/7</p>
								<p>Access to your pet profile and history</p>
							</div>
							<div className="rounded-2xl bg-white/10 p-4 border border-white/10">
								<p className="text-2xl font-bold text-[#f8d548]">1 place</p>
								<p>For vets, trainers, and pet parents to align</p>
							</div>
						</div>
						<div className="flex gap-4 pt-2">
							<Link href="/register" className="bg-[#f8d548] text-[#0c4148] px-7 py-3 rounded-full font-semibold hover:brightness-95 transition shadow-lg shadow-yellow-500/20">
								Get Started
							</Link>
							<Link href="/login" className="border border-white/30 text-white px-7 py-3 rounded-full font-semibold hover:bg-white/10 transition">
								Login
							</Link>
						</div>
					</div>

					<div className="relative flex justify-center">
						<div className="absolute -left-6 -top-6 w-72 h-72 bg-[#f8d548] rounded-full blur-2xl opacity-80"></div>
						<div className="relative w-full max-w-md">
							<div className="absolute -right-4 -top-6 w-20 h-20 rounded-full bg-white/15"></div>
							<Image
								src="/images/cat.png"
								alt="PawCare Cat"
								width={380}
								height={380}
								className="relative z-10 drop-shadow-2xl rounded-full"
							/>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-white text-gray-900 py-16 md:py-20">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8">
					{[
						{ title: 'Our Mission', desc: 'Make pet wellness simple by uniting care, training, and insights in one platform.' },
						{ title: 'How We Work', desc: 'We partner with vets and trainers to provide guided plans, reminders, and secure records.' },
						{ title: 'What You Get', desc: 'Centralized health timelines, progress tracking, and easy bookings for your pet.' },
					].map((item) => (
						<div key={item.title} className="p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition bg-white">
							<h3 className="text-xl font-bold text-[#0f4f57] mb-2">{item.title}</h3>
							<p className="text-gray-600 leading-relaxed">{item.desc}</p>
						</div>
					))}
				</div>
			</section>

			<section className="bg-[#0f4f57] py-14 text-center">
				<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
					<h3 className="text-3xl font-bold">Join the PawCare pack</h3>
					<p className="text-gray-100/85">Set up your pet profile, keep records tidy, and follow training that fits your lifestyle.</p>
					<div className="flex justify-center gap-4">
						<Link href="/register" className="bg-[#f8d548] text-[#0c4148] px-8 py-3 rounded-full font-semibold hover:brightness-95 transition shadow-lg shadow-yellow-500/20">
							Start Free Trial
						</Link>
						<Link href="/" className="border border-white/30 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition">
							Back to Home
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
}
