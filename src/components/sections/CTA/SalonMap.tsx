import { useEffect, useRef } from "react";
import styles from "./salon-map.module.scss";
import { salon } from "../../../data/content";
import logo from "../../../assets/images/logos.png?w=120";

// Leaflet is loaded lazily, only when the map is about to be seen.
export function SalonMap() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let map: import("leaflet").Map | undefined;
    let cancelled = false;

    const init = async () => {
      const [{ default: L }] = await Promise.all([
        import("leaflet"),
        import("leaflet/dist/leaflet.css"),
      ]);
      if (cancelled || !hostRef.current) return;

      map = L.map(hostRef.current, {
        center: [salon.lat, salon.lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: true,
        scrollWheelZoom: false,
        dragging: !L.Browser.mobile, // one-finger scroll must keep working on phones
      });
      map.attributionControl.setPrefix(false);

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        subdomains: "abcd",
        attribution: "© OpenStreetMap © CARTO",
      }).addTo(map);

      L.control.zoom({ position: "bottomright" }).addTo(map);

      const icon = L.divIcon({
        className: styles.markerWrap,
        html: `<span class="${styles.marker}"><img src="${logo}" alt="" /></span>`,
        iconSize: [56, 66],
        iconAnchor: [28, 66],
      });
      L.marker([salon.lat, salon.lng], { icon, title: "BarberSpace", keyboard: false }).addTo(map);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          void init();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(host);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className={styles.wrap}>
      <div ref={hostRef} className={styles.map} role="img" aria-label={`Mapa: BarberSpace, ${salon.address}`} />
    </div>
  );
}
