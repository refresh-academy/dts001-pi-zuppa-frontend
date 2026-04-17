import { useEffect, useRef, useState } from "react"
import type { PuntoDiDistribuzione } from "../types/piuzuppa"
import { getSiteNames } from "../api/backend"

type SiteMultiSelectProps = {
  label: string
  selectedSites: PuntoDiDistribuzione[]
  onChange: (sites: PuntoDiDistribuzione[]) => void
  required?: boolean
}

export function SiteMultiSelect({
  label,
  selectedSites,
  onChange,
  required = false,
}: SiteMultiSelectProps) {
  const [siteOptions, setSiteOptions] = useState<PuntoDiDistribuzione[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    getSiteNames().then((data) => setSiteOptions(data))
  }, [])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
  }, [])

  const toggleSite = (site: PuntoDiDistribuzione) => {
    if (selectedSites.includes(site)) {
      onChange(selectedSites.filter((currentSite) => currentSite !== site))
      return
    }

    onChange([...selectedSites, site])
  }

  const summaryText =
    selectedSites.length === 0
      ? "Seleziona punti di distribuzione..."
      : `${selectedSites.length} selezionati`

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      <label className="text-bianco text-sm font-semibold">
        {label} {required ? "*" : ""}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((currentValue) => !currentValue)}
          className="flex min-h-10 w-full items-center justify-between rounded-md border-2 border-bordeaux bg-sabbia px-3 py-2 text-left text-bordeaux outline-none"
        >
          <div className="flex flex-wrap gap-2">
            {selectedSites.length === 0 ? (
              <span className="text-bordeaux/70">{summaryText}</span>
            ) : (
              selectedSites.map((site) => (
                <span
                  key={site}
                  className="rounded-full bg-amber-900 px-2 py-0.5 text-xs font-semibold text-white"
                >
                  {site}
                </span>
              ))
            )}
          </div>
          <span className="ml-3 shrink-0 text-xs">▼</span>
        </button>

        {isOpen ? (
          <div className="absolute z-20 mt-2 max-h-64 w-full overflow-y-auto rounded-md border-2 border-bordeaux bg-sabbia p-2 shadow-xl">
            {siteOptions.map((site) => (
              <label
                key={site}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-bordeaux hover:bg-amber-100"
              >
                <input
                  type="checkbox"
                  checked={selectedSites.includes(site)}
                  onChange={() => toggleSite(site)}
                  className="h-4 w-4 accent-bordeaux"
                />
                <span>{site}</span>
              </label>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
