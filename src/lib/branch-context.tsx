"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Branch } from "./types";

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
  refreshBranches: () => Promise<void>;
  isLoading: boolean;
  isBranchModalOpen: boolean;
  setIsBranchModalOpen: (open: boolean) => void;
}

const BranchContext = createContext<BranchContextType | undefined>(undefined);

const BRANCH_STORAGE_KEY = "viefood_current_branch_v1";

export function BranchProvider({ children }: { children: React.ReactNode }) {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [currentBranch, setCurrentBranchState] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState<boolean>(false);

  const loadBranches = useCallback(async () => {
    try {
      const res = await fetch("/api/branches", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        const activeList: Branch[] = data.branches || [];
        setBranches(activeList);

        // Check if previously saved branch exists and is still active
        const savedCode = localStorage.getItem(BRANCH_STORAGE_KEY);
        if (savedCode) {
          const found = activeList.find((b: Branch) => b.code === savedCode);
          if (found) {
            setCurrentBranchState(found);
            return;
          }
        }

        // If saved branch was deactivated or not set, default to first active branch
        if (activeList.length > 0) {
          setCurrentBranchState(activeList[0]);
          localStorage.setItem(BRANCH_STORAGE_KEY, activeList[0].code);
        } else {
          setCurrentBranchState(null);
        }
      }
    } catch (e) {
      console.error("Failed to load branches", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  const setCurrentBranch = (branch: Branch) => {
    setCurrentBranchState(branch);
    try {
      localStorage.setItem(BRANCH_STORAGE_KEY, branch.code);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <BranchContext.Provider
      value={{
        branches,
        currentBranch,
        setCurrentBranch,
        refreshBranches: loadBranches,
        isLoading,
        isBranchModalOpen,
        setIsBranchModalOpen,
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const context = useContext(BranchContext);
  if (!context) {
    throw new Error("useBranch must be used within a BranchProvider");
  }
  return context;
}
