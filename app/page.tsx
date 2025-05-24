import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export default function MiniBioGPT() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const askBioGPT = async () => {
    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer YOUR_OPENAI_API_KEY`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a biomedical research assistant.",
            },
            {
              role: "user",
              content: query,
            },
          ],
        }),
      });

      const data = await res.json();
      const answer = data.choices?.[0]?.message?.content || "No response.";
      setResponse(answer);
    } catch (error) {
      console.error(error);
      setResponse("Error fetching response.");
    }
    setLoading(false);
  };

  return (
    <main className="max-w-xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Mini BioGPT</h1>
      <p className="text-sm text-muted-foreground text-center">
        Ask biomedical questions and get LLM-based answers.
      </p>
      <Textarea
        placeholder="E.g., What is the role of laccase in lignin degradation?"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button onClick={askBioGPT} disabled={loading} className="w-full">
        {loading ? <Loader2 className="animate-spin" /> : "Ask BioGPT"}
      </Button>
      {response && (
        <Card>
          <CardContent className="p-4 whitespace-pre-wrap text-sm">
            {response}
          </CardContent>
        </Card>
      )}
    </main>
  );
}
