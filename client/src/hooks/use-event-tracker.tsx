"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCreateEventMutation } from "@/apis/event-api";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  setTabSessionId,
  clearTabSessionId,
} from "@/store/app-state/session-slice";
import { setMetadata } from "@/store/app-state/metadata-slice";
import type { EventDataApi } from "@/apis/types/event";

export const useSessionEventTracker = () => {
  const rawPathname = usePathname();

  const normalizePath = (path: string | null): string => {
    return !path || path === "/" ? "/home" : path;
  };

  const pathname = normalizePath(rawPathname);

  const dispatch = useAppDispatch();
  const [createEvent] = useCreateEventMutation();
  const { country, device, ipAddress, referrer } = useAppSelector(
    (state) => state.metadata,
  );

  const currentPath = useRef<string | null>(null);
  const lastSessionTimestamp = useRef<string | null>(null);
  const isUnloading = useRef(false);

  const tabSessionId = useAppSelector((state) => state.session.tabSessionId);

  // Generate and store session ID
  useEffect(() => {
    const generateTabSessionId = () => {
      const id = "sess_" + crypto.randomUUID();
      const timestamp = new Date().toISOString();
      sessionStorage.setItem("tabSessionId", id);
      sessionStorage.setItem("tabSessionCreatedAt", timestamp);
      return id;
    };

    const getOrCreateTabSessionId = () => {
      return sessionStorage.getItem("tabSessionId") || generateTabSessionId();
    };

    const id = getOrCreateTabSessionId();
    dispatch(setTabSessionId(id));
  }, [dispatch]);

  // Fetch metadata once
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const response = await fetch("/api/metadata");
        if (!response.ok) throw new Error("Failed to fetch metadata");

        const data = await response.json();
        dispatch(
          setMetadata({
            country: data.country || null,
            device: data.device || null,
            referrer: data.referrer || null,
            ipAddress: data.ipAddress || null,
          }),
        );
      } catch (error) {
        console.error("Metadata fetch error:", error);
      }
    };

    fetchMeta();
  }, [dispatch]);

  // Send events
  const sendEvent = async (
    type: "page_view" | "click" | "session_end",
    rawPage: string,
  ) => {
    const id = sessionStorage.getItem("tabSessionId");
    const page = normalizePath(rawPage);

    if (!id || !page) return;

    // Wait until metadata is fully populated
    if (!country || !device || !ipAddress) return;

    const eventData: EventDataApi = {
      type,
      page,
      sessionId: id,
      country: country ?? "",
      device: device ?? navigator.userAgent,
      referrer: referrer ?? document.referrer ?? "",
    };

    try {
      await createEvent(eventData).unwrap();
    } catch (err) {
      console.error("Event sending failed", err);
    }
  };

  // Track page views
  useEffect(() => {
    const sessionTimestamp = sessionStorage.getItem("tabSessionCreatedAt");

    if (
      pathname &&
      country &&
      device &&
      ipAddress &&
      (currentPath.current !== pathname ||
        lastSessionTimestamp.current !== sessionTimestamp)
    ) {
      currentPath.current = pathname;
      lastSessionTimestamp.current = sessionTimestamp;
      sendEvent("page_view", pathname);
    }
  }, [pathname, country, device, ipAddress, referrer]);

  useEffect(() => {
    const handleUnload = () => {
      if (!isUnloading.current && pathname) {
        isUnloading.current = true;
        sendEvent("session_end", pathname);
        sessionStorage.removeItem("tabSessionId");
        sessionStorage.removeItem("tabSessionCreatedAt");
        dispatch(clearTabSessionId());
      }
    };

    window.addEventListener("beforeunload", handleUnload);
    window.addEventListener("pagehide", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      window.removeEventListener("pagehide", handleUnload);
    };
  }, [pathname, dispatch]);

  return {
    trackClick: (customPath?: string) =>
      sendEvent("click", normalizePath(customPath ?? pathname)),
  };
};
