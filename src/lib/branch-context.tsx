"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Branch } from "./types";

interface BranchContextType {
  branches: Branch[];
  currentBranch: Branch | null;
  setCurrentBranch: (branch: Branch) => void;
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

  useEffect(() => {
    async function loadBranches() {
      try {
        const res = await fetch("/api/branches");
        if (res.ok) {
          const data = await res.json();
          setBranches(data.branches || []);

          // Check if previously saved branch exists
          const savedCode = localStorage.getItem(BRANCH_STORAGE_KEY);
          if (savedCode) {
            const found = (data.branches || []).find((b: Branch) => b.code === savedCode);
            if (found) {
              setCurrentBranchState(found);
              return;
            }
          }

          // Default to first branch (e.g. HCM Q1)
          if (data.branches && data.branches.length > 0) {
            setCurrentBranchState(data.branches[0]);
          }
        }
      } catch (e) {
        console.error("Failed to load branches", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadBranches();
  }, []);

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

