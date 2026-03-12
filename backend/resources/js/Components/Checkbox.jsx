export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-full border-slate-300 text-[#5768AD] shadow-sm focus:ring-2 focus:ring-[#5768AD] focus:ring-offset-2 w-5 h-5 cursor-pointer transition-all ' +
                className
            }
        />
    );
}
