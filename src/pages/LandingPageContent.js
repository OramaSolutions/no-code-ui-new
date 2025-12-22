  import {
  Search,
  BarChart3,
  Eye,
  FileText,
  Layers,
  CheckCircle,
  Zap,
  Download,
  Camera,
  Upload,
  Settings,
  TestTube,
  MessageSquare,
  Menu,
  X
} from "lucide-react";
  
  export const applications = [
    {
      icon: Eye,
      title: "Assembly Verification",
      type: "Object Detection & Sequence",
      description: "Verify assembly steps and component presence with sequence validation.",
      features: ["Model Retraining", "Fine-tuning", "Real-time Monitoring", "Sequence Validation"],
      availableFor: ["Single Camera", "Fine-tuning Available", "Model Retraining"]
    },
    {
      icon: Layers,
      title: "Sequence Matching",
      type: "Temporal Analysis",
      description: "Match and validate process sequences against predefined patterns.",
      features: ["Temporal Analysis", "Pattern Recognition", "Custom Sequences", "Alert System"],
      availableFor: ["Single Camera", "Fine-tuning Available", "Model Retraining"]
    },
    {
      icon: Search,
      title: "Defect Detection",
      type: "Computer Vision",
      description: "Detect visual defects, scratches, dents, and anomalies on surfaces.",
      features: ["High Precision", "Multiple Defect Types", "Real-time Detection", "Quality Reports"],
      availableFor: ["Single Camera", "Fine-tuning Available", "Model Retraining"]
    },
    {
      icon: FileText,
      title: "OCR & Text Extraction",
      type: "Optical Character Recognition",
      description: "Extract text from images, documents, and product labels with high accuracy.",
      features: ["Multi-language", "Handwriting Support", "Formatting Preservation", "Batch Processing"],
      availableFor: ["Single Camera", "Fine-tuning Available", "Model Retraining"]
    }
  ];

  export const modelTypes = [
    {
      name: "Defect Detection Software",
      description: "Advanced computer vision systems for identifying product defects and quality issues.",
      icon: Eye,
      applications: ["Surface Inspection", "Component Verification", "Quality Control"]
    },
    {
      name: "Object Detection Software",
      description: "Real-time object recognition and localization for industrial applications.",
      icon: Search,
      applications: ["Assembly Verification", "Inventory Management", "Safety Compliance"]
    },
    {
      name: "Classification Software",
      description: "AI-powered classification systems for sorting and categorizing products.",
      icon: Layers,
      applications: ["Product Sorting", "Quality Grading", "Category Identification"]
    },
    {
      name: "OCR/Text Extraction",
      description: "Intelligent text recognition for document processing and data extraction.",
      icon: FileText,
      applications: ["Label Reading", "Document Digitization", "Data Entry Automation"]
    }
  ];

  export const processSteps = {
    classification: [
      { icon: Upload, title: "Upload Dataset", description: "Upload classification dataset or label images directly in the software" },
      { icon: BarChart3, title: "Data Augmentation", description: "Apply transformations to enhance dataset diversity" },
      { icon: Layers, title: "Split Data", description: "Divide data into training and validation sets" },
      { icon: Settings, title: "Hyperparameter Tuning", description: "Optimize model parameters for best performance" },
      { icon: Zap, title: "Start Training", description: "Train the classification model with your data" },
      { icon: TestTube, title: "Test Inference", description: "Evaluate model performance on test data" },
      { icon: MessageSquare, title: "Add Remarks", description: "Add notes and observations about the model" },
      { icon: Download, title: "Download Application", description: "Export the trained model as a deployable application" }
    ],
    objectDetection: [
      { icon: Upload, title: "Upload Dataset", description: "Upload classification dataset or label images directly in the software" },
      { icon: BarChart3, title: "Data Augmentation", description: "Apply transformations to enhance dataset diversity" },
      { icon: Layers, title: "Split Data", description: "Divide data into training and validation sets" },
      { icon: Settings, title: "Hyperparameter Tuning", description: "Optimize model parameters for best performance" },
      { icon: Zap, title: "Start Training", description: "Train the classification model with your data" },
      { icon: TestTube, title: "Test Inference", description: "Evaluate model performance on test data" },
      { icon: MessageSquare, title: "Add Remarks", description: "Add notes and observations about the model" },
      { icon: Download, title: "Download Application", description: "Export the trained model as a deployable application" }
    ],
    defectDetection: [
      { icon: Upload, title: "Upload Labeled Dataset", description: "Upload pre-labeled dataset or label images in the software" },
      { icon: Settings, title: "Hyperparameter Tuning", description: "Optimize detection parameters and model settings" },
      { icon: Zap, title: "Start Training", description: "Train the Defect Detection model with your data" },
      { icon: TestTube, title: "Test Inference", description: "Run inference on sample images to verify detection" },
      { icon: MessageSquare, title: "Add Remarks", description: "Document findings and model behavior" },
      { icon: Download, title: "Download Application", description: "Export the trained defect detection system" }
    ]
  };