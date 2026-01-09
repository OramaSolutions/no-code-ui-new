import React from "react";
import { Link } from "react-router-dom";

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

import { applications , modelTypes, processSteps} from "./LandingPageContent";
import Navbar from "./../commonComponent/Navbar.jsx";



// Process Step Component
const ProcessStep = ({ icon: Icon, title, description, step }) => (
  <div className="flex items-start space-x-4 p-2 rounded-lg hover:bg-white/5 transition">
    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
      <Icon className="h-5 w-5" />
    </div>
    <div>
      <div className="flex items-center space-x-2 mb-1">
        <span className="text-sm font-semibold text-indigo-300">Step {step}</span>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  </div>
);

// Application Card Component
const ApplicationCard = ({ icon: Icon, title, type, description, features, availableFor }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow hover:shadow-xl transition-all h-full">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Icon className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <span className="text-sm text-indigo-700 font-medium">{type}</span>
        </div>
      </div>
      {availableFor.includes("Single Camera") && (
        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
          Single Camera Available
        </span>
      )}
    </div>

    <p className="text-gray-700 mb-4">{description}</p>

    <div className="mb-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">Features:</h4>
      <ul className="space-y-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
    </div>

    <div className="mb-6">
      <h4 className="text-sm font-semibold text-gray-900 mb-2">Available For:</h4>
      <div className="flex flex-wrap gap-2">
        {availableFor.map((item, idx) => (
          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
            {item}
          </span>
        ))}
      </div>
    </div>

    <div className="flex justify-between items-center">
      <Link
        to="/login"
        className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition flex items-center"
      >
        <Camera className="h-4 w-4 mr-2" />
        Demo Setup
      </Link>
      <Link
        to="/contact"
        className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white transition"
      >
        Learn More
      </Link>
    </div>
  </div>
);

const LandingPage = () => {

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with multiple gradients and grain effect */}
      <div className="absolute inset-0 bg-gradient-to-br text-gray-100 from-indigo-900 via-purple-900 to-blue-900">

        {/* Noise/grain texture */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc0IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')] opacity-[0.02]"></div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(147,197,253,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(147,197,253,0.3)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5"></div>
        </div>
      </div>

      <div className="relative z-10">
        <Navbar />

        {/* ---------- Hero Section ---------- */}
        <section className="w-full px-6 pt-32 pb-24 text-center relative">

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent animate-gradient">
            Industrial AI Applications
            <br />
            <span className="text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text">
              Made Simple
            </span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto opacity-90 mb-8 text-gray-100">
            Deploy state-of-the-art computer vision solutions for manufacturing,
            quality control, and industrial automation with our no-code platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="px-8 py-3 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 transition font-semibold text-lg shadow-lg"
            >
              Start Free Trial
            </Link>
            <a
              href="#applications"
              className="px-8 py-3 rounded-xl border-2 border-white text-gray-100 hover:bg-white/10 transition font-semibold text-lg"
            >
              Explore Applications
            </a>
          </div>
        </section>

        {/* ---------- What We Do Section ---------- */}
        <section id="features" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">
              AI Solutions We Provide
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {modelTypes.map((type, idx) => (
                <div
                  key={idx}
                  className="relative group border-2 border-transparent rounded-xl p-[3px] overflow-hidden"
                >
                  {/* Animated border - simple sweep effect */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent animate-border-sweep"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-indigo-500 opacity-20"></div>
                  </div>

                  {/* Main card */}
                  <div className="h-full flex flex-col justify-between items-center relative bg-gradient-to-br bg-black backdrop-blur-sm rounded-lg p-6 z-10">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700/50">
                      <type.icon className="h-8 w-8 text-cyan-400" />
                    </div>

                    <h3 className="text-xl font-semibold mb-3 text-white text-center max-w-[200px] ">
                      {type.name}
                    </h3>

                    <p className="text-gray-300 mb-6 text-center text-sm">
                      {type.description}
                    </p>

                    <div className="space-y-3">
                      {type.applications.map((app, appIdx) => (
                        <div key={appIdx} className="flex items-start">
                          <CheckCircle className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-200 text-sm">{app}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Applications Marketplace ---------- */}
        <section id="applications" className="bg-white text-gray-900 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Ready-to-Deploy AI Applications</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Each application supports single camera setup with fine-tuning and model retraining capabilities.
                Choose from our pre-built solutions or customize for your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {applications.map((app, idx) => (
                <ApplicationCard key={idx} {...app} />
              ))}
            </div>

            {/* Key Features */}
            <div className="bg-indigo-50 rounded-2xl p-8 mb-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Platform Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Single and Multi Camera Setup</h4>
                  <p className="text-gray-600">All applications work with single camera configurations</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Fine-Tuning</h4>
                  <p className="text-gray-600">Customize models with your specific data</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Download className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2">Easy Deployment</h4>
                  <p className="text-gray-600">Download and deploy trained applications easily</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Process Flow Section ---------- */}
        <section id="process" className="bg-gradient-to-r text-gray-100 from-blue-900 to-indigo-900 py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Simple Workflow Process</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Classification Process */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center mb-6">
                  <Layers className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">Classification Process</h3>
                </div>
                <div className="space-y-3">
                  {processSteps.classification.map((step, idx) => (
                    <ProcessStep key={idx} {...step} step={idx + 1} />
                  ))}
                </div>
              </div>
              {/* Object Detection */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center mb-6">
                  <Layers className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">Object Detection Process</h3>
                </div>
                <div className="space-y-3">
                  {processSteps.objectDetection.map((step, idx) => (
                    <ProcessStep key={idx} {...step} step={idx + 1} />
                  ))}
                </div>
              </div>

              {/* Defect Detection Process */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="flex items-center mb-6">
                  <Eye className="h-8 w-8 mr-3" />
                  <h3 className="text-2xl font-bold">Defect Detection Process</h3>
                </div>
                <div className="space-y-3">
                  {processSteps.defectDetection.map((step, idx) => (
                    <ProcessStep key={idx} {...step} step={idx + 1} />
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ---------- CTA Section ---------- */}
        <section className="bg-white py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Transform Your Operations?</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Start with a single camera setup and scale as you grow. All applications come with fine-tuning capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="px-8 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold text-lg"
              >
                Schedule a Demo
              </Link>
              <Link
                to="/login"
                className="px-8 py-3 rounded-lg border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition font-semibold text-lg"
              >
                Try Free Demo
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="bg-gray-900 text-gray-400 py-8 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  {/* <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-indigo-600" />
                </div> */}
                  <span className="text-xl font-bold text-white">Orama Solutions</span>
                </div>
                <p className="text-sm mt-2">Industrial AI Applications Platform</p>
              </div>
              <div className="flex space-x-6">
                <Link to="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
                <Link to="/contact" className="hover:text-white transition">
                  Contact
                </Link>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
              <p>© 2025 Orama Solutions. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;