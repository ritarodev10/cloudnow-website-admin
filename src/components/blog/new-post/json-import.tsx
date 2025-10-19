"use client";

import { useState } from "react";
import { FileText, Upload, AlertCircle, CheckCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

import { BlogPostFormData } from "@/types/blog-strapi";

interface JsonImportProps {
  onImport: (data: BlogPostFormData) => void;
  onCancel: () => void;
}

export function JsonImport({ onImport, onCancel }: JsonImportProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const validateAndParseJson = () => {
    setIsValidating(true);
    setError("");

    try {
      if (!jsonInput.trim()) {
        setError("Please enter JSON data");
        setIsValidating(false);
        return;
      }

      const parsed = JSON.parse(jsonInput);

      // Validate required fields
      const requiredFields = ["title", "content"];
      const missingFields = requiredFields.filter(field => !parsed[field]);

      if (missingFields.length > 0) {
        setError(`Missing required fields: ${missingFields.join(", ")}`);
        setIsValidating(false);
        return;
      }

      // Create BlogPostFormData object with defaults
      const formData: BlogPostFormData = {
        title: parsed.title || "",
        slug: parsed.slug || "",
        excerpt: parsed.excerpt || "",
        content: parsed.content || "",
        status: parsed.status || "draft",
        featured: parsed.featured || false,
        allowComments: parsed.allowComments !== false, // default true
        category: parsed.category || 1,
        tags: parsed.tags || [],
        author: parsed.author || 1,
        seoTitle: parsed.seoTitle || "",
        seoDescription: parsed.seoDescription || "",
        seoKeywords: parsed.seoKeywords || "",
        publishedAt: parsed.publishedAt || "",
        ...parsed, // Include any additional fields
      };

      onImport(formData);
    } catch (err) {
      setError(`Invalid JSON format: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setIsValidating(false);
    }
  };

  const generateSampleJson = () => {
    const sampleData = {
      title: "Sample Blog Post",
      slug: "sample-blog-post",
      excerpt: "This is a sample blog post created via JSON import.",
      content: "<p>This is the main content of the blog post. You can use HTML tags here.</p><p>Multiple paragraphs are supported.</p>",
      status: "draft",
      featured: false,
      allowComments: true,
      category: 1,
      tags: [1, 2],
      author: 1,
      seoTitle: "Sample Blog Post - SEO Title",
      seoDescription: "This is the SEO description for the sample blog post.",
      seoKeywords: "sample, blog, post, json",
      publishedAt: ""
    };

    setJsonInput(JSON.stringify(sampleData, null, 2));
  };

  return (
    <Card className="bg-gray-950 border-gray-800">
      <CardHeader className="bg-gray-900 border-b border-gray-800">
        <CardTitle className="flex items-center gap-2 text-gray-100">
          <FileText className="h-5 w-5 text-blue-400" />
          JSON Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-300">JSON Data</label>
            <Button
              variant="outline"
              size="sm"
              onClick={generateSampleJson}
              className="gap-2 bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              <FileText className="size-4" />
              Sample JSON
            </Button>
          </div>
          <Textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder="Paste your JSON data here..."
            className="font-mono text-sm min-h-[600px] bg-gray-900 text-gray-100 border-gray-700 focus:border-blue-500 focus:ring-blue-500/20 resize-none rounded-lg p-4"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1 bg-gray-800 border-gray-700 text-gray-300">
              <CheckCircle className="size-3 text-green-400" />
              Required: title, content
            </Badge>
            <Badge variant="outline" className="gap-1 bg-gray-800 border-gray-700 text-gray-300">
              <CheckCircle className="size-3 text-green-400" />
              Optional: slug, excerpt, status, etc.
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={validateAndParseJson}
              disabled={isValidating}
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Upload className="size-4" />
              {isValidating ? "Validating..." : "Import JSON"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
