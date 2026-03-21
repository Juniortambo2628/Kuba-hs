<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FAQ;
use App\Models\Testimonial;

class ManualSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            ['question' => 'What is Kuba?', 'answer' => 'Kuba is a premium service platform connecting you to top-rated professionals in Nairobi.', 'is_active' => true, 'order' => 1],
            ['question' => 'How do I book a service?', 'answer' => 'Simply search for your needed service, choose a professional, and select a time that works for you directly from your dashboard.', 'is_active' => true, 'order' => 2],
            ['question' => 'Is payment secure?', 'answer' => 'Yes! We use industry-standard encryption and trusted payment gateways to secure your transactions.', 'is_active' => true, 'order' => 3],
            ['question' => 'What if I am not satisfied?', 'answer' => 'We offer a satisfaction guarantee. Our elite support team is available 24/7 to resolve any issues immediately.', 'is_active' => true, 'order' => 4],
        ];

        foreach($faqs as $faq) { 
            FAQ::create($faq); 
        }

        $testimonials = [
            ['client_name' => 'Sarah Kamau', 'client_role' => 'Business Owner', 'content' => 'Kuba has completely transformed how I manage my office maintenance. The professionals are top-tier and always on time!', 'rating' => 5, 'image_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', 'is_active' => true, 'order' => 1],
            ['client_name' => 'Mwangi Peter', 'client_role' => 'Homeowner', 'content' => 'I needed a plumber urgently and found one through Kuba within minutes. Excellent service and totally reliable.', 'rating' => 5, 'image_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mwangi', 'is_active' => true, 'order' => 2],
            ['client_name' => 'Joy Mutheu', 'client_role' => 'Corporate Manager', 'content' => 'The consolidated billing for our enterprise needs makes accounting so much easier. Highly recommended for any Nairobi office!', 'rating' => 5, 'image_url' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joy', 'is_active' => true, 'order' => 3],
        ];

        foreach($testimonials as $test) { 
            Testimonial::create($test); 
        }
    }
}
