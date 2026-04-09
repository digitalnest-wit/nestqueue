package models

import (
	"bytes"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

// Ticket represents an IT ticket with associated metadata
type Ticket struct {
	ID                   string                 `json:"id" bson:"_id"`
	Title                string                 `json:"title"`
	Description          string                 `json:"description"`
	Site                 string                 `json:"site"`
	Category             string                 `json:"category"`
	AssignedTo           string                 `json:"assignedTo"`
	CreatedBy            string                 `json:"createdBy"`
	Priority             int                    `json:"priority"`
	Status               string                 `json:"status"`
	WorkflowStatus       string                 `json:"workflowStatus" bson:"workflowStatus"`
	DeviceID             string                 `json:"deviceId" bson:"deviceId"`
	Location             string                 `json:"location" bson:"location"`
	Documentation        TicketDocumentation    `json:"documentation" bson:"documentation"`
	TroubleshootingSteps []string               `json:"troubleshootingSteps" bson:"troubleshootingSteps"`
	Escalation           TicketEscalation       `json:"escalation" bson:"escalation"`
	ActivityLog          []TicketActivityLogEntry `json:"activityLog" bson:"activityLog"`
	Instructor           TicketInstructorReview `json:"instructor" bson:"instructor"`
	CreatedOn            time.Time              `json:"createdOn"`
	UpdatedAt            time.Time              `json:"updatedAt"`
}

type TicketDocumentation struct {
	ReportedProblem     string `json:"reportedProblem" bson:"reportedProblem"`
	InitialObservations string `json:"initialObservations" bson:"initialObservations"`
	QuestionsAsked      string `json:"questionsAsked" bson:"questionsAsked"`
	RootCause           string `json:"rootCause" bson:"rootCause"`
	SolutionApplied     string `json:"solutionApplied" bson:"solutionApplied"`
	Verification        string `json:"verification" bson:"verification"`
	FinalNotes          string `json:"finalNotes" bson:"finalNotes"`
}

type TicketEscalation struct {
	Enabled bool   `json:"enabled" bson:"enabled"`
	Reason  string `json:"reason" bson:"reason"`
}

type TicketActivityLogEntry struct {
	ID        string `json:"id" bson:"id"`
	Label     string `json:"label" bson:"label"`
	Timestamp string `json:"timestamp" bson:"timestamp"`
}

type TicketInstructorReview struct {
	Reviewed              bool   `json:"reviewed" bson:"reviewed"`
	CompletedSuccessfully bool   `json:"completedSuccessfully" bson:"completedSuccessfully"`
	Notes                 string `json:"notes" bson:"notes"`
}

// UnmarshalBSON provides a custom unmarshal implementation for Ticket, enabling
// the decoder to implicitly decode ObjectIDs as Hex strings.
func (t *Ticket) UnmarshalBSON(data []byte) error {
	var (
		buffer bytes.Buffer
		result struct {
			ID                   string                   `json:"id" bson:"_id"`
			Title                string                   `json:"title"`
			Description          string                   `json:"description"`
			Site                 string                   `json:"site"`
			Category             string                   `json:"category"`
			AssignedTo           string                   `json:"assignedTo"`
			CreatedBy            string                   `json:"createdBy"`
			Priority             int                      `json:"priority"`
			Status               string                   `json:"status"`
			WorkflowStatus       string                   `json:"workflowStatus" bson:"workflowStatus"`
			DeviceID             string                   `json:"deviceId" bson:"deviceId"`
			Location             string                   `json:"location" bson:"location"`
			Documentation        TicketDocumentation      `json:"documentation" bson:"documentation"`
			TroubleshootingSteps []string                 `json:"troubleshootingSteps" bson:"troubleshootingSteps"`
			Escalation           TicketEscalation         `json:"escalation" bson:"escalation"`
			ActivityLog          []TicketActivityLogEntry `json:"activityLog" bson:"activityLog"`
			Instructor           TicketInstructorReview   `json:"instructor" bson:"instructor"`
			CreatedOn            time.Time                `json:"createdOn"`
			UpdatedAt            time.Time                `json:"updatedAt"`
		}
	)
	_, _ = buffer.Write(data)

	decoder := bson.NewDecoder(bson.NewDocumentReader(&buffer))
	decoder.ObjectIDAsHexString()

	if err := decoder.Decode(&result); err != nil {
		return err
	}

	*t = Ticket{
		ID:                   result.ID,
		Title:                result.Title,
		Description:          result.Description,
		Site:                 result.Site,
		Category:             result.Category,
		AssignedTo:           result.AssignedTo,
		CreatedBy:            result.CreatedBy,
		Priority:             result.Priority,
		Status:               result.Status,
		WorkflowStatus:       result.WorkflowStatus,
		DeviceID:             result.DeviceID,
		Location:             result.Location,
		Documentation:        result.Documentation,
		TroubleshootingSteps: result.TroubleshootingSteps,
		Escalation:           result.Escalation,
		ActivityLog:          result.ActivityLog,
		Instructor:           result.Instructor,
		CreatedOn:            result.CreatedOn,
		UpdatedAt:            result.UpdatedAt,
	}

	return nil
}
