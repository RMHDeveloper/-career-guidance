import { CareerRoadmap, SavedRoadmap } from "../types";

const STORAGE_KEY = "bunny-career-roadmaps";
const PROGRESS_PREFIX = "bunny-timeline-";
const MAX_SAVED = 20;

export function getSavedRoadmaps(): SavedRoadmap[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function makeId(): string {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const norm = (s: string) => s.trim().toLowerCase();

export function saveRoadmap(
  qualification: string,
  interests: string,
  roadmap: CareerRoadmap,
  currentSkills?: string
): SavedRoadmap {
  const entry: SavedRoadmap = {
    id: makeId(),
    qualification,
    interests,
    currentSkills,
    roadmap,
    createdAt: Date.now(),
  };

  try {
    const existing = getSavedRoadmaps().filter(
      (r) => norm(r.qualification) !== norm(qualification) || norm(r.interests) !== norm(interests)
    );
    const next = [entry, ...existing].slice(0, MAX_SAVED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (err) {
    console.error("Could not save roadmap to localStorage:", err);
  }

  return entry;
}

export function deleteRoadmap(id: string): void {
  try {
    const next = getSavedRoadmaps().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    localStorage.removeItem(PROGRESS_PREFIX + id);
  } catch (err) {
    console.error("Could not delete roadmap from localStorage:", err);
  }
}

// ---- Timeline step completion, keyed by saved-roadmap id ----

export function getTimelineProgress(id: string): Record<string, boolean> {
  if (!id) return {};
  try {
    const raw = localStorage.getItem(PROGRESS_PREFIX + id);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function setTimelineProgress(id: string, progress: Record<string, boolean>): void {
  if (!id) return;
  try {
    localStorage.setItem(PROGRESS_PREFIX + id, JSON.stringify(progress));
  } catch (err) {
    console.error("Could not save timeline progress:", err);
  }
}
