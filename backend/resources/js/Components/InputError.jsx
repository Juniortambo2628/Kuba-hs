export default function InputError({ message, className = '', ...props }) {
    return message ? (
        <p
            {...props}
            className={'text-xs font-bold text-red-700 ' + className}
        >
            {message}
        </p>
    ) : null;
}
