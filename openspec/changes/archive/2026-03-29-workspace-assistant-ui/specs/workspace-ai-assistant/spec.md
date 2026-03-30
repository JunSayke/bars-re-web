## ADDED Requirements

### Requirement: Draggable AI Assistant Panel
The system SHALL provide a floating, draggable, and resizable panel within the workspace editor canvas to house the AI assistant.

#### Scenario: User toggles the panel
- **WHEN** the user activates the AI Assistant from the workspace menu
- **THEN** the floating panel appears on top of the editor canvas

#### Scenario: User moves the panel
- **WHEN** the user drags the header of the AI Assistant panel
- **THEN** the panel follows the cursor and updates its x/y coordinates without locking the underlying editor

### Requirement: Lyrics Input State
The system SHALL allow users to input specific bars or lyrics they want analyzed, independent of the main editor content.

#### Scenario: User prepares lyrics for analysis
- **WHEN** the panel is in the default input state
- **THEN** it displays a textarea with a character/word limit counter and an "Analyze Lyrics" button

#### Scenario: User triggers analysis
- **WHEN** the user clicks "Analyze Lyrics"
- **THEN** the system disables the input, shows a loading state, and invokes the backend analysis action

### Requirement: Structured Feedback Display
The system SHALL render the AI feedback in a structured, readable format once analysis is complete.

#### Scenario: Analysis completes successfully
- **WHEN** the backend returns the structured feedback JSON
- **THEN** the panel hides the input form and displays the overall Score, a list of Flow Issues (with specific line references), and General Suggestions
