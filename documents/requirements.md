# Requirements Document

## Introduction

Crons is a modern AI-powered calendar and task management application that enables users to create cascading (dependency-based) cron flows and schedules. The system combines the visual clarity of Google Calendar with AI assistance and advanced automation capabilities. Users can design cron sequences that automatically unfold over time, where completing one cron triggers the scheduling of the next cron in the flow, with AI providing intelligent scheduling suggestions and optimization.

## Glossary

- **System**: The Crons application
- **User**: A person using Crons to manage tasks and workflows
- **Cron**: A custom task or action with scheduling rules, duration, and dependencies
- **Cron_Flow**: A sequence of connected crons that execute in dependency order
- **Template**: A reusable cron flow pattern that can be instantiated multiple times
- **Active_Cron**: A cron that is currently available for completion
- **Cascading**: The automatic scheduling behavior where cron completion triggers the next cron
- **Calendar_View**: The main interface displaying crons on a calendar grid
- **Flow_Builder**: The visual interface for creating and editing cron flow templates
- **AI_Assistant**: The intelligent system that provides scheduling suggestions and optimizations

## Requirements

### Requirement 1: Calendar Dashboard Interface

**User Story:** As a user, I want a comprehensive calendar dashboard, so that I can view and manage my cascading crons in a familiar calendar interface.

#### Acceptance Criteria

1. THE System SHALL display a three-panel layout with left sidebar, main calendar area, and collapsible right details panel
2. THE System SHALL provide monthly and weekly calendar view toggles in the main area
3. THE System SHALL show crons as colored blocks on the calendar with flow-specific colors
4. WHEN a cron belongs to a cascading flow, THE System SHALL display a chain link icon on the cron block
5. WHEN a user hovers over a cron, THE System SHALL show a tooltip with cron name, flow name, and duration
6. THE System SHALL display sidebar sections for Today, Upcoming, Cron Flows, Templates, Completed, and Settings

### Requirement 2: Cron Detail Management

**User Story:** As a user, I want to view and manage cron details, so that I can track progress and complete crons efficiently.

#### Acceptance Criteria

1. WHEN a user clicks on a cron, THE System SHALL open the right details panel
2. THE System SHALL display cron title, flow name, status toggle, scheduled time, and duration in the details panel
3. WHEN a user toggles a cron status to completed, THE System SHALL mark the cron as complete and trigger the next cron in the flow
4. THE System SHALL provide a "View full flow" button that opens the active cron flow timeline
5. WHEN a cron is completed, THE System SHALL automatically schedule the next dependent cron according to its scheduling rules

### Requirement 3: Cron Flow Template Library

**User Story:** As a user, I want to create and manage cron flow templates, so that I can reuse common cron sequences.

#### Acceptance Criteria

1. THE System SHALL display a cron flow templates page with existing templates as cards
2. THE System SHALL provide a "Create New Cron Flow Template" button at the top of the templates page
3. THE System SHALL show template cards containing flow name, number of steps, visual step flow preview, and action buttons
4. THE System SHALL provide Edit and "Start Flow" buttons on each template card
5. WHEN a user clicks "Start Flow", THE System SHALL open the start flow modal

### Requirement 4: Visual Cron Flow Builder (n8n-style)

**User Story:** As a user, I want to design completely custom cron flows using a visual n8n-style builder, so that I can create complex automation sequences tailored to my specific needs.

#### Acceptance Criteria

1. THE System SHALL provide a visual flow builder interface similar to n8n with drag-and-drop nodes and connections
2. THE System SHALL support different cron modes: Task Mode (completion-based) and Deadline Mode (time-based with countdown)
3. THE System SHALL allow users to create custom cron nodes with configurable titles, descriptions, and mode settings
4. THE System SHALL provide connection lines between cron nodes to define dependency relationships
5. THE System SHALL support conditional branching and parallel execution paths in cron flows
6. THE System SHALL validate flow logic and prevent circular dependencies before saving
7. WHEN a cron is in Deadline Mode, THE System SHALL display remaining days countdown in the calendar view

### Requirement 5: Cron Modes and Dynamic Calendar Integration

**User Story:** As a user, I want different cron modes with dynamic calendar integration, so that I can handle both completion-based tasks and time-sensitive deadlines effectively.

#### Acceptance Criteria

1. THE System SHALL support Task Mode crons that appear on calendar only when their parent cron is completed
2. THE System SHALL support Deadline Mode crons that show countdown timers and remaining days in calendar view
3. WHEN a parent cron in Task Mode is completed, THE System SHALL automatically schedule and display the next cron on the calendar
4. WHEN a cron is in Deadline Mode, THE System SHALL calculate and display remaining days until deadline
5. THE System SHALL provide visual indicators to distinguish between Task Mode (completion icon) and Deadline Mode (clock/countdown icon)
6. THE System SHALL handle mixed-mode flows where some crons are task-based and others are deadline-based
7. THE System SHALL support custom scheduling rules: T+1 (next day), T+3 (three days later), specific dates, and relative timing

### Requirement 6: Cron Flow Execution Management

**User Story:** As a user, I want to start and monitor custom cron flow execution, so that I can track progress through complex sequences with different modes.

#### Acceptance Criteria

1. WHEN a user starts a cron flow, THE System SHALL initialize only the first cron node and keep subsequent nodes inactive
2. THE System SHALL dynamically add crons to the calendar as their parent dependencies are completed
3. THE System SHALL maintain flow state and track which nodes are active, completed, or waiting for dependencies
4. THE System SHALL provide a flow execution timeline showing the current state of all nodes in the flow
5. THE System SHALL handle complex flows with multiple branches and parallel execution paths

### Requirement 7: Cascading Cron Automation

**User Story:** As a user, I want crons to automatically cascade when completed, so that my custom flows progress without manual intervention.

#### Acceptance Criteria

1. WHEN a cron is marked complete, THE System SHALL automatically activate the next connected cron nodes in the flow
2. THE System SHALL apply the scheduling rules (T+1, T+3, custom timing) to determine when next crons appear on calendar
3. THE System SHALL support parallel activation when multiple crons depend on the same completed parent
4. THE System SHALL handle conditional flows where completion of one cron can trigger different paths
5. THE System SHALL maintain flow integrity and prevent activation of crons whose dependencies are incomplete

### Requirement 8: Responsive Mobile Interface

**User Story:** As a mobile user, I want to access my cascading crons on mobile devices, so that I can manage custom flows on the go.

#### Acceptance Criteria

1. THE System SHALL provide a responsive mobile layout for the calendar view with collapsible sidebar
2. THE System SHALL adapt the cron details panel to a bottom drawer interface on mobile devices
3. THE System SHALL maintain cron flow timeline functionality in a mobile-optimized vertical layout
4. THE System SHALL ensure touch-friendly interaction targets for all mobile interface elements
5. THE System SHALL preserve core functionality including flow builder access across desktop and mobile interfaces

### Requirement 9: Complex Flow Example Support

**User Story:** As a user, I want to create complex multi-mode flows like medical appointment workflows, so that I can handle real-world scenarios with mixed task and deadline requirements.

#### Acceptance Criteria

1. THE System SHALL support flows combining Task Mode and Deadline Mode crons in sequence (e.g., Book appointment → Follow up T+1 → Create plan by T+3 → Plan costings)
2. THE System SHALL handle T+N scheduling where N represents days after completion (T+1 = next day, T+3 = three days later)
3. THE System SHALL display deadline countdown for time-sensitive crons showing remaining days until deadline
4. THE System SHALL automatically progress through mixed-mode sequences when parent crons are completed
5. THE System SHALL maintain visual distinction between task-based completion and deadline-based time tracking within the same flow

### Requirement 10: Visual Design and User Experience

**User Story:** As a user, I want a clean and modern interface, so that I can focus on productivity without visual distractions.

#### Acceptance Criteria

1. THE System SHALL implement a minimal, modern design with soft rounded cards and subtle shadows
2. THE System SHALL use a light mode default with clear visual hierarchy and ample white space
3. THE System SHALL apply consistent accent colors (blue or purple) for active crons and interactive elements
4. THE System SHALL provide appropriate icons for linked crons (chain), time (clock), and automation (spark/gear)
5. THE System SHALL ensure visual states clearly distinguish between completed (green with checkmark), active (highlighted), and future (greyed with lock) crons

### Requirement 11: AI-Powered Cron Creation

**User Story:** As a user, I want to create cron flows using natural language prompts, so that I can quickly build complex workflows without manual node configuration.

#### Acceptance Criteria

1. THE System SHALL provide an AI tab in the flow builder interface for natural language cron creation
2. WHEN a user describes a workflow in natural language, THE AI_Assistant SHALL generate a complete n8n-style flow with appropriate nodes and connections
3. THE AI_Assistant SHALL present the generated flow in a user-readable format for validation and editing before saving
4. THE System SHALL allow users to modify AI-generated flows using the visual flow builder
5. THE AI_Assistant SHALL support complex workflow descriptions including mixed task and deadline modes with relative timing

### Requirement 12: AI Template Management

**User Story:** As a user, I want AI assistance in creating and managing cron flow templates, so that I can build a library of reusable workflows efficiently.

#### Acceptance Criteria

1. THE System SHALL provide pre-built template prompts for common workflow patterns (e.g., "Create a project management flow", "Build a follow-up sequence")
2. THE System SHALL allow users to create custom template prompts that can be reused for similar workflows
3. THE AI_Assistant SHALL generate template variations based on user-provided template prompts
4. THE System SHALL save user-created template prompts for future use and sharing
5. THE AI_Assistant SHALL suggest relevant templates based on natural language descriptions

### Requirement 13: AI-Generated Daily Summary

**User Story:** As a user, I want an AI-generated summary of my daily tasks, so that I can quickly understand my schedule and priorities.

#### Acceptance Criteria

1. THE System SHALL display an AI-generated text summary of the day's tasks on the dashboard page
2. THE System SHALL store all cron data in an AI-readable format to enable intelligent summarization
3. THE AI_Assistant SHALL analyze task priorities, deadlines, and dependencies to create meaningful daily summaries
4. THE System SHALL update the daily summary dynamically as tasks are completed or modified throughout the day
5. THE AI_Assistant SHALL highlight urgent deadlines, overdue tasks, and upcoming dependencies in the summary

### Requirement 14: AI-Powered Scheduling Assistant

**User Story:** As a user, I want AI assistance for scheduling and optimizing my cron flows, so that I can create more efficient and realistic schedules.

#### Acceptance Criteria

1. THE AI_Assistant SHALL analyze cron flow patterns and suggest optimal scheduling rules
2. WHEN a user creates a new cron flow, THE AI_Assistant SHALL recommend realistic durations based on similar crons
3. THE AI_Assistant SHALL detect scheduling conflicts and suggest alternative time slots
4. THE AI_Assistant SHALL provide intelligent suggestions for cron flow templates based on user behavior patterns
5. THE AI_Assistant SHALL optimize existing cron flows by suggesting improvements to reduce total completion time

### Requirement 15: Data Persistence and State Management

**User Story:** As a user, I want my cron flows and crons to persist reliably, so that I don't lose my work and progress.

#### Acceptance Criteria

1. THE System SHALL persist all cron flow templates, active flows, and cron states to local storage
2. THE System SHALL maintain cron flow execution state across browser sessions
3. THE System SHALL handle data synchronization when multiple browser tabs are open
4. THE System SHALL provide data export functionality for cron flow templates and cron history
5. THE System SHALL validate data integrity and handle corrupted state gracefully