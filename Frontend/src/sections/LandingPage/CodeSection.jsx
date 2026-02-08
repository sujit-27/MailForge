import { useState } from "react";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  CheckCircle2,
  Copy,
  Download,
  Globe,
  Zap,
  Code,
  Coffee,
  TerminalSquare,
  FileJson,
  DiamondIcon,
} from "lucide-react";
import {SiPython, SiRuby, SiGo, SiPhp, SiRust, SiElixir, SiDotnet, SiServerless, SiHttpie, SiNodedotjs } from "react-icons/si";
import { FaJava } from "react-icons/fa";

const languageIcons = {
  "Node.js": <SiNodedotjs className="w-6 h-6" />,
  "Serverless": <SiServerless className="w-6 h-6" />,
  "Ruby": <SiRuby className="w-6 h-6" />,
  "Python": <SiPython className="w-6 h-6" />,
  "PHP": <SiPhp className="w-6 h-6" />,
  "Go": <SiGo className="w-6 h-6" />,
  "Rust": <SiRust className="w-6 h-6" />,
  "Java": <FaJava className="w-6 h-6" />,
  "Elixir": <SiElixir className="w-6 h-6" />,
  ".NET": <SiDotnet className="w-6 h-6" />,
  "REST": <SiHttpie className="w-6 h-6" />,
};


const codeExamples = [
  {
    key: "js",
    language: "javascript",
    label: "Node.js",
    code: `const axios = require('axios');

const payload = {
  recipients: ["customer@email.com"],
  templateId: "68461782xxxxx",
  variables: { name: "Alex", orderId: "12345" }
};

const resp = await axios.post('https://api.mailforge.io/api/emails/v1/send', payload, {
  headers: { 'X-API-KEY': 'your_api_key' }
});`
  },
  {
    key: "serverless",
    language: "javascript",
    label: "Serverless",
    code: `// AWS Lambda / Vercel Function
exports.handler = async (event) => {
  const fetch = require('node-fetch');
  
  await fetch('https://api.mailforge.io/api/emails/v1/send', {
    method: 'POST',
    headers: { 'X-API-KEY': process.env.API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipients: [JSON.parse(event.body).email],
      templateId: "68461782xxxxx"
    })
  });
};`
  },
  {
    key: "ruby",
    language: "ruby",
    label: "Ruby",
    code: `require 'net/http'
require 'json'

uri = URI('https://api.mailforge.io/api/emails/v1/send')
req = Net::HTTP::Post.new(uri, 'Content-Type' => 'application/json')
req['X-API-KEY'] = 'your_api_key'

req.body = {
  recipients: ['customer@email.com'],
  templateId: '68461782xxxxx',
  variables: { name: 'Alex' }
}.to_json

res = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) { |http| http.request(req) }`
  },
  {
    key: "python",
    language: "python",
    label: "Python",
    code: `import requests

url = "https://api.mailforge.io/api/emails/v1/send"
headers = {"X-API-KEY": "your_api_key"}
data = {
    "recipients": ["customer@email.com"],
    "templateId": "68461782xxxxx",
    "variables": {"name": "Alex", "orderId": "12345"}
}

response = requests.post(url, json=data, headers=headers)`
  },
  {
    key: "php",
    language: "php",
    label: "PHP",
    code: `$ch = curl_init('https://api.mailforge.io/api/emails/v1/send');
$payload = json_encode([
    "recipients" => ["customer@email.com"],
    "templateId" => "68461782xxxxx",
    "variables" => ["name" => "Alex"]
]);

curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'X-API-KEY: your_api_key'
]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);`
  },
  {
    key: "go",
    language: "go",
    label: "Go",
    code: `payload := map[string]interface{}{
    "recipients": []string{"customer@email.com"},
    "templateId": "68461782xxxxx",
    "variables":  map[string]string{"name": "Alex"},
}
body, _ := json.Marshal(payload)

req, _ := http.NewRequest("POST", "https://api.mailforge.io/api/emails/v1/send", bytes.NewBuffer(body))
req.Header.Set("X-API-KEY", "your_api_key")
req.Header.Set("Content-Type", "application/json")

client := &http.Client{}
client.Do(req)`
  },
  {
    key: "rust",
    language: "rust",
    label: "Rust",
    code: `let client = request::Client::new();
let mut body = HashMap::new();
body.insert("recipients", vec!["customer@email.com"]);
body.insert("templateId", vec!["68461782xxxxx"]);

let res = client.post("https://api.mailforge.io/api/emails/v1/send")
    .header("X-API-KEY", "your_api_key")
    .json(&body)
    .send()
    .await?;`
  },
  {
    key: "java",
    language: "java",
    label: "Java",
    code: `RestTemplate rest = new RestTemplate();
HttpHeaders headers = new HttpHeaders();
headers.set("X-API-KEY", apiKey);

Map<String, Object> payload = Map.of(
  "recipients", List.of("customer@email.com"),
  "templateId", "68461782xxxxx",
  "variables", Map.of("name", "Alex")
);

HttpEntity entity = new HttpEntity(payload, headers);
rest.postForEntity("https://api.mailforge.io/api/emails/v1/send", entity, String.class);`
  },
  {
    key: "elixir",
    language: "elixir",
    label: "Elixir",
    code: `body = %{
  recipients: ["customer@email.com"],
  templateId: "68461782xxxxx",
  variables: %{name: "Alex"}
}

HTTPoison.post("https://api.mailforge.io/api/emails/v1/send", 
  Poison.encode!(body), 
  [{"X-API-KEY", "your_api_key"}, {"Content-Type", "application/json"}]
)`
  },
  {
    key: "dotnet",
    language: "csharp",
    label: ".NET",
    code: `var client = new HttpClient();
client.DefaultRequestHeaders.Add("X-API-KEY", "your_api_key");

var data = new {
    recipients = new[] { "customer@email.com" },
    templateId = "68461782xxxxx",
    variables = new { name = "Alex" }
};

var response = await client.PostAsJsonAsync(
    "https://api.mailforge.io/api/emails/v1/send", data
);`
  },
  {
    key: "rest",
    language: "http",
    label: "REST",
    code: `POST /api/emails/v1/send HTTP/1.1
Host: api.mailforge.io
X-API-KEY: your_api_key
Content-Type: application/json

{
  "recipients": ["customer@email.com"],
  "templateId": "68461782xxxxx",
  "variables": {
    "name": "Alex",
    "orderId": "12345"
  }
}`
  }
];

export default function CodeSection() {
  const [selected, setSelected] = useState(0);
  const [copied, setCopied] = useState(false);

  const selectedExample = codeExamples[selected];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedExample.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1300);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedExample.code], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `mailforge-example-${selectedExample.key}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="pt-16 pb-20 bg-black/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
            Send Emails <span className="text-white/80">Effortlessly</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Build and deliver with MailForge SDKs, REST APIs, and Serverless integrations for every stack.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex flex-wrap justify-center gap-8 mb-10">
          {codeExamples.map((ex, idx) => (
            <button
              key={ex.key}
              onClick={() => setSelected(idx)}
              className={`flex flex-col items-center transition-all duration-200 ${
                selected === idx ? "scale-105" : "opacity-70 hover:opacity-100"
              }`}
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all ${
                  selected === idx
                    ? "border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20"
                    : "border-white/20 bg-black/50 hover:border-white/40"
                }`}
              >
                {languageIcons[ex.label] || <Code className="w-6 h-6 text-white" />}
              </div>
              <span
                className={`mt-3 text-sm font-medium ${
                  selected === idx ? "text-purple-400" : "text-gray-300"
                }`}
              >
                {ex.label}
              </span>
            </button>
          ))}
        </div>

        {/* Code editor box */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-gradient-to-b from-[#1a1b1e] to-[#0e0f10]"
        >
          {/* Subtle glowing border */}
          <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-purple-700/40 via-pink-500/30 to-indigo-700/40 opacity-50 blur-xl"></div>

          {/* Active language badge (Top-left) */}
          <div className="absolute top-5 left-6 flex items-center gap-2 bg-white/10 border border-white/50 px-3 py-2 rounded-lg z-10 backdrop-blur-sm">
            {languageIcons[selectedExample.label] ? (
              <span className="text-purple-400/80">{languageIcons[selectedExample.label]}</span>
            ) : (
              <Code className="w-5 h-5 text-yellow-800" />
            )}
            <span className="text-sm font-medium text-gray-200">{selectedExample.label}</span>
          </div>

          {/* Copy + Download buttons */}
          <div className="absolute top-5 right-6 flex gap-2 z-10">
            <button
              onClick={handleDownload}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-2 text-gray-200"
              title="Download code"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handleCopy}
              className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-2 text-gray-200 flex items-center gap-1"
              title="Copy code"
            >
              <Copy className="w-5 h-5" />
              <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>

          {/* Syntax Highlighter */}
          <SyntaxHighlighter
            language={selectedExample.language.toLowerCase()}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              padding: "4.5rem 2rem 2rem 2rem",
              fontSize: "0.95rem",
              background: "transparent",
              color: "#fff",
            }}
            showLineNumbers
          >
            {selectedExample.code}
          </SyntaxHighlighter>
        </motion.div>
      </div>
    </section>
  );
}
