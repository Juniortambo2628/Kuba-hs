import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'w-full bg-white border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-medium placeholder:text-slate-400 focus:border-[#5768AD] focus:ring-4 focus:ring-[#5768AD]/10 outline-none transition-all ' +
                className
            }
            ref={localRef}
        />
    );
});
