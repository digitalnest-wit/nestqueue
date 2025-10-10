"use client";

import { BookOpen, CheckCircle } from "lucide-react";
import { FormEvent, useState } from "react";

import Button from "../ui/button";
import LabeledIcon from "../ui/labeled-icon";
import Modal from "../ui/modal";

export interface TicketCompleteModalProps {
  isOpen: boolean;
  ticketTitle: string;
  existingDocumentation?: string;
  onClose: () => void;
  onComplete: (documentation: string) => void;
  isLoading?: boolean;
}

export default function TicketCompleteModal({
  isOpen,
  ticketTitle,
  existingDocumentation = "",
  onClose,
  onComplete,
  isLoading = false,
}: TicketCompleteModalProps) {
  const [documentation, setDocumentation] = useState(existingDocumentation);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onComplete(documentation);
  };

  const handleClose = () => {
    setDocumentation(existingDocumentation); // Reset to original value
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="max-w-2xl p-4">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Complete Ticket
            </h3>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            <strong>Ticket:</strong> {ticketTitle}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Before marking this ticket as complete, please document how you resolved it. 
            This helps other team members learn from your solution.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-300 mb-2">
              <LabeledIcon className="mr-2" icon={<BookOpen className="w-4" />} label="Resolution Documentation" />
            </label>
            <textarea
              value={documentation}
              onChange={(e) => setDocumentation(e.target.value)}
              placeholder="Describe how you resolved this ticket:&#10;• What was the root cause?&#10;• What steps did you take?&#10;• What solution worked?&#10;• Any preventive measures for the future?"
              className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Documentation is required to complete the ticket
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-white rounded"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white rounded"
              disabled={isLoading || !documentation.trim()}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Completing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Ticket
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}