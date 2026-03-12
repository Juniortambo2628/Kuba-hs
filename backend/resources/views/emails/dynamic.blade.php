<x-mail::message>
<div style="text-align: center; margin-bottom: 20px;">
    <img src="{{ url('/logo.png') }}" alt="Kuba Logo" style="height: 60px; width: auto;">
</div>

{!! $content !!}

<x-slot:footer>
    <x-mail::footer>
        © {{ date('Y') }} Kuba. All rights reserved.
        @if(isset($unsubscribe_url))
        <br>
        [Unsubscribe]({{ $unsubscribe_url }})
        @endif
    </x-mail::footer>
</x-slot:footer>
</x-mail::message>
