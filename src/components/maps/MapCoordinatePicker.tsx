"use client";

import dynamic from "next/dynamic";

const InteractiveMap = dynamic(() => import("./MapCoordinatePickerInner"), {
  ssr: false,
  loading: () => <div className="grid h-72 place-items-center rounded-box bg-base-200"><span className="loading loading-spinner loading-lg text-primary" /></div>,
});

type Props = { latitude?: number; longitude?: number; onChange: (latitude: number, longitude: number) => void; disabled?: boolean };

export function MapCoordinatePicker(props: Props) {
  return <InteractiveMap {...props} />;
}
