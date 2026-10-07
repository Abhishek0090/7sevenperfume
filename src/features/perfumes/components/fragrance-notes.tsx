import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { FragranceNote, NoteFamily, NoteLayer } from "../types";

const familyStyles: Record<NoteFamily, string> = {
  citrus: "bg-amber-100 text-amber-900 border-amber-200",
  floral: "bg-pink-100 text-pink-900 border-pink-200",
  woody: "bg-orange-100 text-orange-950 border-orange-200",
  spicy: "bg-red-100 text-red-900 border-red-200",
  fresh: "bg-sky-100 text-sky-900 border-sky-200",
  sweet: "bg-yellow-100 text-yellow-900 border-yellow-200",
  musky: "bg-stone-100 text-stone-800 border-stone-200",
  green: "bg-emerald-100 text-emerald-900 border-emerald-200",
  fruity: "bg-purple-100 text-purple-900 border-purple-200",
};

const layers: { value: NoteLayer | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "top", label: "Top" },
  { value: "heart", label: "Heart" },
  { value: "base", label: "Base" },
];

function NotePills({ notes }: { notes: FragranceNote[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {notes.map((note) => (
        <li
          key={`${note.layer}-${note.name}`}
          className={cn(
            "rounded-full border px-3.5 py-1.5 text-sm font-medium",
            familyStyles[note.family],
          )}
          title={`${note.family} note`}
        >
          {note.name}
        </li>
      ))}
    </ul>
  );
}

export function FragranceNotes({ notes }: { notes: FragranceNote[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold tracking-widest uppercase">Fragrance notes</h3>
      <Tabs defaultValue="all">
        <TabsList className="bg-muted">
          {layers.map((layer) => (
            <TabsTrigger key={layer.value} value={layer.value} className="px-3">
              {layer.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {layers.map((layer) => (
          <TabsContent key={layer.value} value={layer.value} className="pt-3">
            <NotePills
              notes={layer.value === "all" ? notes : notes.filter((n) => n.layer === layer.value)}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
