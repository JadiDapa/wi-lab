"use client";

import { useState } from "react";

interface UploadedEvidence {
  image: string;
  latitude?: number;
  longitude?: number;
  altitude?: number;
}

export default function ManualGT() {
  const [evidences, setEvidences] = useState<UploadedEvidence[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [alt, setAlt] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSave = () => {
    if (!preview) return;

    setEvidences((prev) => [
      ...prev,
      {
        image: preview,
        latitude: lat ? parseFloat(lat) : undefined,
        longitude: lng ? parseFloat(lng) : undefined,
        altitude: alt ? parseFloat(alt) : undefined,
      },
    ]);

    // reset
    setPreview(null);
    setLat("");
    setLng("");
    setAlt("");
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Upload Report Evidence</h1>

      {/* Upload Input */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="mb-4"
      />

      {/* Preview with manual input */}
      {preview && (
        <div className="rounded-lg border bg-gray-100 p-4">
          <img
            src={preview}
            alt="preview"
            className="mb-4 max-h-64 w-full object-contain"
          />

          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="rounded border p-2"
            />
            <input
              type="number"
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="rounded border p-2"
            />
            <input
              type="number"
              placeholder="Altitude (m)"
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
              className="rounded border p-2"
            />
          </div>

          <button
            onClick={handleSave}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Save Evidence
          </button>
        </div>
      )}

      {/* List of uploaded evidences */}
      <div className="grid grid-cols-3 gap-4">
        {evidences.map((evidence, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-lg border bg-white shadow"
          >
            <img
              src={evidence.image}
              alt={`evidence-${idx}`}
              className="h-32 w-full object-cover"
            />
            <div className="p-2 text-sm">
              {evidence.latitude && <p>Lat: {evidence.latitude.toFixed(5)}</p>}
              {evidence.longitude && (
                <p>Lng: {evidence.longitude.toFixed(5)}</p>
              )}
              {evidence.altitude && <p>Alt: {evidence.altitude} m</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
