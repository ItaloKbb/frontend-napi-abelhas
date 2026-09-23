"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

type Props = { latitude?: number; longitude?: number; onChange: (latitude: number, longitude: number) => void; disabled?: boolean };
const BRAZIL_CENTER: LatLngExpression = [-14.235, -51.9253];
const markerIcon = L.divIcon({ className: "", html: '<span class="block size-6 -translate-x-1/2 -translate-y-full rounded-full rounded-bl-none border-2 border-white bg-primary shadow-lg" style="transform:translate(-50%,-100%) rotate(-45deg)"></span>', iconSize: [24, 24], iconAnchor: [12, 24] });

function MapController({ position, onPick, disabled }: { position?: LatLngExpression; onPick: Props["onChange"]; disabled?: boolean }) {
  const map = useMap();
  useMapEvents({ click(event) { if (!disabled) onPick(Number(event.latlng.lat.toFixed(7)), Number(event.latlng.lng.toFixed(7))); } });
  useEffect(() => { if (position) map.flyTo(position, Math.max(map.getZoom(), 13), { duration: .5 }); }, [map, position]);
  return null;
}

export default function MapCoordinatePickerInner({ latitude, longitude, onChange, disabled }: Props) {
  const [locationError, setLocationError] = useState("");
  const [locating, setLocating] = useState(false);
  const hasPosition = Number.isFinite(latitude) && Number.isFinite(longitude);
  const position = useMemo<LatLngExpression | undefined>(() => hasPosition ? [latitude as number, longitude as number] : undefined, [hasPosition, latitude, longitude]);

  function useCurrentLocation() {
    if (!navigator.geolocation) return setLocationError("Geolocalização não disponível neste navegador.");
    setLocating(true); setLocationError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => { onChange(Number(coords.latitude.toFixed(7)), Number(coords.longitude.toFixed(7))); setLocating(false); },
      () => { setLocationError("Não foi possível obter sua localização. Verifique a permissão do navegador."); setLocating(false); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  return <div className="space-y-2"><div className="relative overflow-hidden rounded-box border border-base-300 bg-base-200">
    <MapContainer center={position ?? BRAZIL_CENTER} zoom={position ? 13 : 4} scrollWheelZoom className="h-72 w-full" aria-label="Mapa para selecionar coordenadas">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapController position={position} onPick={onChange} disabled={disabled} />
      {position && <Marker position={position} icon={markerIcon} draggable={!disabled} eventHandlers={{ dragend(event) { const point = event.target.getLatLng(); onChange(Number(point.lat.toFixed(7)), Number(point.lng.toFixed(7))); } }} />}
    </MapContainer>
    {!hasPosition && <div className="pointer-events-none absolute inset-x-0 top-3 z-[500] mx-auto w-fit rounded-full bg-base-100/90 px-3 py-1.5 text-xs font-medium shadow">Clique no mapa para marcar o ponto</div>}
  </div><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-base-content/55">Clique no mapa ou arraste o marcador para ajustar.</p><button type="button" className="btn btn-ghost btn-sm" onClick={useCurrentLocation} disabled={disabled || locating}>{locating && <span className="loading loading-spinner loading-xs" />}Usar minha localização</button></div>{locationError && <p role="alert" className="text-xs text-error">{locationError}</p>}</div>;
}
