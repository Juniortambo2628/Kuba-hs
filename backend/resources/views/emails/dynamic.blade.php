<x-mail::message>
<div style="text-align: center; margin-bottom: 30px;">
    @if(isset($logo_url))
        <img src="{{ $logo_url }}" alt="{{ $app_name ?? 'Kuba' }}" style="height: 60px; max-width: 200px; object-fit: contain;">
    @else
        <img src="{{ url('/assets/branding/Kuba-Header-footter-Logo-for-Light-Mode.png') }}" alt="Kuba Logo" style="height: 60px; width: auto;">
    @endif
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
