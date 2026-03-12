import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { 
  Award, Star, Gift, History, TrendingUp, 
  ChevronRight, Sparkles, CheckCircle2, ArrowRight
} from 'lucide-react';
import DashboardShell from '@/Components/DashboardShell';
import { Button } from '@/Components/ui/button';
import { Progress } from '@/Components/ui/progress';
import { Badge } from '@/Components/ui/badge';

export default function Loyalty({ auth }) {
    // Mock data for design/placeholder
    const loyaltyInfo = {
        points: 1250,
        tier: 'Gold',
        pointsToNextTier: 250,
        nextTier: 'Platinum',
        progress: 80,
        transactions: [
            { id: 1, action: 'House Cleaning Service', date: '2023-10-15', points: '+150', status: 'earned' },
            { id: 2, action: 'Referral Bonus', date: '2023-10-10', points: '+500', status: 'earned' },
            { id: 3, action: 'Redeemed: $10 Discount', date: '2023-10-05', points: '-1000', status: 'redeemed' },
        ],
        availableRewards: [
            { id: 1, title: '$5 Off Next Service', cost: 500, description: 'Redeem for a $5 discount on any residential cleaning.' },
            { id: 2, title: 'Free Window Cleaning Upgrade', cost: 1200, description: 'Add window cleaning to your next booking for free.' },
            { id: 3, title: 'Priority Booking Access', cost: 2000, description: 'Get first pick of premium weekend slots.' },
        ]
    };

    return (
        <AuthenticatedLayout>
            <Head title="Loyalty Program" />

            <DashboardShell
                title="Loyalty Rewards"
                subtitle="Earn points on every service and redeem them for exclusive discounts."
            >
                <div className="space-y-8 max-w-6xl mx-auto">
                    {/* Hero Section: Current Status */}
                    <div className="relative overflow-hidden rounded-3xl bg-[#0D9488] p-8 lg:p-12 text-white shadow-2xl shadow-teal-500/20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3 blur-3xl" />
                        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                        <Award className="h-6 w-6 text-amber-300" />
                                    </div>
                                    <Badge variant="outline" className="text-[11px] font-bold uppercase tracking-widest text-teal-100 border-teal-400 bg-teal-500/20">
                                        {loyaltyInfo.tier} Member
                                    </Badge>
                                </div>
                                <h2 className="text-4xl lg:text-5xl font-black mb-4 tracking-tight">You've got {loyaltyInfo.points} <span className="text-teal-200">Points!</span></h2>
                                <p className="text-teal-50/70 text-lg mb-8 max-w-md leading-relaxed">
                                    You're doing great! You're only {loyaltyInfo.pointsToNextTier} points away from <span className="text-amber-300 font-bold underline decoration-amber-300/30 underline-offset-4">{loyaltyInfo.nextTier}</span> status.
                                </p>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm font-bold uppercase tracking-widest mb-1.5 text-teal-100/60">
                                        <span>Current Progress</span>
                                        <span>{loyaltyInfo.progress}%</span>
                                    </div>
                                    <div className="h-4 w-full bg-teal-900/40 rounded-full overflow-hidden border border-teal-700/50">
                                        <div 
                                            className="h-full bg-gradient-to-r from-amber-200 to-amber-400 transition-all duration-1000 animate-pulse-slow" 
                                            style={{ width: `${loyaltyInfo.progress}%` }} 
                                        />
                                    </div>
                                    <div className="flex justify-between text-[11px] font-bold text-teal-200/50 uppercase tracking-tighter">
                                        <span>{loyaltyInfo.tier}</span>
                                        <span>{loyaltyInfo.nextTier}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 lg:p-8 space-y-6">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-amber-300" />
                                    Tier Benefits
                                </h3>
                                <ul className="space-y-4">
                                    {[
                                        '5% extra points on every booking',
                                        'Exclusive monthly member discounts',
                                        'Birthday reward (500 pts)',
                                        'Priority support access'
                                    ].map((benefit, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="h-5 w-5 rounded-full bg-teal-400/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle2 className="h-3 w-3 text-teal-300" />
                                            </div>
                                            <span className="text-sm text-teal-50/90 font-medium">{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button className="w-full bg-white text-[#0D9488] hover:bg-teal-50 font-bold uppercase tracking-widest text-xs h-12 shadow-xl">
                                    View All Member Perks
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Rewards Catalog */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                        <Gift className="h-5 w-5 text-orange-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Available Rewards</h3>
                                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Treat yourself!</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {loyaltyInfo.availableRewards.map((reward) => (
                                    <div key={reward.id} className="group bg-card rounded-2xl border shadow-sm p-6 transition-all hover:border-primary/30 hover:shadow-md">
                                        <div className="flex justify-between items-start mb-4">
                                            <Badge variant="outline" className="bg-orange-50 text-orange-600 border-orange-100 font-bold uppercase text-[10px] tracking-widest">
                                                {reward.cost} PTS
                                            </Badge>
                                            {loyaltyInfo.points >= reward.cost ? (
                                                <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                </div>
                                            ) : (
                                                <div className="h-2 w-10 bg-muted rounded-full overflow-hidden">
                                                    <div className="h-full bg-muted-foreground/20" style={{ width: `${(loyaltyInfo.points / reward.cost) * 100}%` }} />
                                                </div>
                                            )}
                                        </div>
                                        <h4 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">{reward.title}</h4>
                                        <p className="text-xs text-muted-foreground leading-relaxed mb-6 font-medium">{reward.description}</p>
                                        <Button 
                                            disabled={loyaltyInfo.points < reward.cost}
                                            variant={loyaltyInfo.points >= reward.cost ? "default" : "secondary"}
                                            className="w-full h-10 text-[10px] font-bold uppercase tracking-widest"
                                        >
                                            {loyaltyInfo.points >= reward.cost ? "Redeem Now" : "Not Enough Points"}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent History */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                                    <History className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">Point History</h3>
                                    <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Recent activity</p>
                                </div>
                            </div>

                            <div className="bg-card rounded-2xl border shadow-sm divide-y">
                                {loyaltyInfo.transactions.map((tx) => (
                                    <div key={tx.id} className="p-4 flex items-center justify-between transition-colors hover:bg-muted/10">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-foreground">{tx.action}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{tx.date}</p>
                                        </div>
                                        <span className={cn(
                                            "text-xs font-black font-mono",
                                            tx.status === 'earned' ? "text-emerald-600" : "text-red-500"
                                        )}>
                                            {tx.points}
                                        </span>
                                    </div>
                                ))}
                                <Link 
                                    href="#" 
                                    className="p-4 block text-center text-[10px] font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-colors rounded-b-2xl"
                                >
                                    View Full Statement <ArrowRight className="inline h-3 w-3 ml-1" />
                                </Link>
                            </div>

                            {/* Earn more */}
                            <div className="bg-muted/20 border-2 border-dashed rounded-2xl p-6 text-center">
                                <TrendingUp className="h-8 w-8 text-muted-foreground/30 mx-auto mb-3" />
                                <h4 className="font-bold text-sm mb-2">Want more points?</h4>
                                <p className="text-[10px] text-muted-foreground font-medium mb-4 leading-relaxed uppercase tracking-wider">
                                    Refer a friend today and get 500 points when they book their first service!
                                </p>
                                <Button variant="outline" size="sm" className="h-8 text-[10px] font-bold uppercase tracking-widest">
                                    Get Referral Link
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardShell>
        </AuthenticatedLayout>
    );
}
