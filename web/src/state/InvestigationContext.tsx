import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InvestigateResponse, Assessment } from '../types/api';
import { markdownToPlainText } from '../lib/format';

interface InvestigationState {
  message: string;
  sender?: string;
  display_name?: string;
  headers?: string;
  response?: InvestigateResponse;
  editedDraft?: string;
  reviewerName?: string;
  checkboxChecked: boolean;
  saveResult?: { id: string; status: string };
}

interface InvestigationContextType {
  state: InvestigationState;
  setMessage: (message: string) => void;
  setOptionalDetails: (details: { sender?: string; display_name?: string; headers?: string }) => void;
  setResponse: (response: InvestigateResponse) => void;
  setEditedDraft: (draft: string) => void;
  setReviewerName: (name: string) => void;
  setCheckboxChecked: (checked: boolean) => void;
  setSaveResult: (result: { id: string; status: string } | undefined) => void;
  reset: () => void;
  getAssessment: () => Assessment | undefined;
}

const InvestigationContext = createContext<InvestigationContextType | undefined>(undefined);

const STORAGE_KEY = 'ai_investigation_state';

const initialState: InvestigationState = {
  message: '',
  checkboxChecked: false,
};

export function InvestigationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InvestigationState>(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.editedDraft) {
          parsed.editedDraft = markdownToPlainText(parsed.editedDraft);
        }
        return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return initialState;
  });

  // Persist to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const setMessage = (message: string) => {
    setState(prev => ({ ...prev, message }));
  };

  const setOptionalDetails = (details: { sender?: string; display_name?: string; headers?: string }) => {
    setState(prev => ({ ...prev, ...details }));
  };

  const setResponse = (response: InvestigateResponse) => {
    setState(prev => ({ 
      ...prev, 
      response,
      // Always store clean plain text for draft
      editedDraft: response.type === 'assessment' 
        ? markdownToPlainText(response.draft) 
        : undefined
    }));
  };

  const setEditedDraft = (draft: string) => {
    setState(prev => ({ ...prev, editedDraft: draft }));
  };

  const setReviewerName = (name: string) => {
    setState(prev => ({ ...prev, reviewerName: name }));
  };

  const setCheckboxChecked = (checked: boolean) => {
    setState(prev => ({ ...prev, checkboxChecked: checked }));
  };

  const setSaveResult = (result: { id: string; status: string } | undefined) => {
    setState(prev => ({ ...prev, saveResult: result }));
  };

  const reset = () => {
    setState(initialState);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  const getAssessment = (): Assessment | undefined => {
    if (state.response && state.response.type === 'assessment') {
      return state.response;
    }
    return undefined;
  };

  return (
    <InvestigationContext.Provider
      value={{
        state,
        setMessage,
        setOptionalDetails,
        setResponse,
        setEditedDraft,
        setReviewerName,
        setCheckboxChecked,
        setSaveResult,
        reset,
        getAssessment,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
}

export function useInvestigation() {
  const context = useContext(InvestigationContext);
  if (context === undefined) {
    throw new Error('useInvestigation must be used within an InvestigationProvider');
  }
  return context;
}
