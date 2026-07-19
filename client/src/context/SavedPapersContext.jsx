import { createContext, useContext, useState, useEffect, useCallback } from "react";
import * as api from "../api";

const SavedPapersContext = createContext(null);

/**
 * Holds the set of paper IDs the logged-in user has saved (wishlisted).
 * Loads once when a profile is present, and exposes optimistic toggling
 * so a Save button can live on any card or page without prop-threading.
 */
export function SavedPapersProvider({ children }) {
  const [savedIds, setSavedIds] = useState(() => new Set());
  const [loaded, setLoaded] = useState(false);

  const isLoggedIn = () => Boolean(localStorage.getItem("profile"));

  const loadSaved = useCallback(async () => {
    if (!isLoggedIn()) {
      setSavedIds(new Set());
      setLoaded(true);
      return;
    }
    try {
      const { data } = await api.fetchSavedPapers();
      setSavedIds(new Set(data.map((p) => p._id)));
    } catch (err) {
      console.error("Failed to load saved papers:", err);
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadSaved();
  }, [loadSaved]);

  const isSaved = useCallback((id) => savedIds.has(id), [savedIds]);

  /**
   * Optimistically toggles saved state for a paper.
   * Returns the new saved boolean, or throws so callers can surface errors.
   */
  const toggleSave = useCallback(async (id) => {
    const willSave = !savedIds.has(id);
    // optimistic update
    setSavedIds((prev) => {
      const next = new Set(prev);
      willSave ? next.add(id) : next.delete(id);
      return next;
    });
    try {
      const { data } = await api.toggleSavePaper(id);
      // reconcile with server truth
      setSavedIds((prev) => {
        const next = new Set(prev);
        data.saved ? next.add(id) : next.delete(id);
        return next;
      });
      return data.saved;
    } catch (err) {
      // roll back on failure
      setSavedIds((prev) => {
        const next = new Set(prev);
        willSave ? next.delete(id) : next.add(id);
        return next;
      });
      throw err;
    }
  }, [savedIds]);

  return (
    <SavedPapersContext.Provider value={{ savedIds, isSaved, toggleSave, loaded, refreshSaved: loadSaved }}>
      {children}
    </SavedPapersContext.Provider>
  );
}

export function useSavedPapers() {
  const ctx = useContext(SavedPapersContext);
  if (!ctx) {
    throw new Error("useSavedPapers must be used within a SavedPapersProvider");
  }
  return ctx;
}
