# Design Document: Crons - AI-Powered Cascading Task Calendar

## Overview

Crons is a modern AI-powered calendar and task management application that revolutionizes productivity through cascading cron flows. The system combines the visual clarity of Google Calendar with intelligent automation and n8n-style workflow building capabilities. Users can create complex task sequences that automatically unfold over time, with AI assistance for natural language workflow creation, intelligent scheduling, and daily summaries.

The application features a three-panel dashboard layout, an n8n-inspired visual flow builder, dual cron modes (Task Mode and Deadline Mode), and comprehensive AI integration for workflow generation and optimization.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI Components]
        Calendar[Calendar View]
        FlowBuilder[n8n-style Flow Builder]
        AIChat[AI Chat Interface]
    end
    
    subgraph "State Management"
        Store[Redux/Zustand Store]
        CronState[Cron State Manager]
        FlowState[Flow Execution Engine]
    end
    
    subgraph "AI Services"
        NLProcessor[Natural Language Processor]
        FlowGenerator[Workflow Generator]
        Summarizer[Daily Summary Generator]
        Optimizer[Schedule Optimizer]
    end
    
    subgraph "Core Services"
        CronEngine[Cron Execution Engine]
        Scheduler[Dynamic Scheduler]
        Validator[Flow Validator]
    end
    
    subgraph "Data Layer"
        LocalStorage[Browser Local Storage]
        StateSync[Multi-tab Sync]
        Export[Data Export Service]
    end
    
    UI --> Store
    Calendar --> CronEngine
    FlowBuilder --> FlowState
    AIChat --> NLProcessor
    NLProcessor --> FlowGenerator
    FlowGenerator --> FlowBuilder
    Store --> LocalStorage
    CronEngine --> Scheduler
    FlowState --> CronEngine
```