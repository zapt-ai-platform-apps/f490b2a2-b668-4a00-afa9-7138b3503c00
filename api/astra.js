import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.VITE_PUBLIC_SENTRY_DSN,
  environment: process.env.VITE_PUBLIC_APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.VITE_PUBLIC_APP_ID
    }
  }
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('API request received:', req.body);
    const { messages, stream = false } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key not configured');
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // If stream is requested, handle streaming response
    if (stream) {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      });

      try {
        console.log('Sending streaming request to OpenAI');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages,
            stream: true,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error from OpenAI:', error);
          throw new Error(error.error?.message || `OpenAI API error: ${response.status}`);
        }

        console.log('Streaming response started');
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            if (line.includes('[DONE]')) {
              res.write('data: [DONE]\n\n');
              continue;
            }
            
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              res.write(`data: ${data}\n\n`);
            }
          }

          // Flush the response to ensure the client gets each chunk immediately
          res.flush && res.flush();
        }
        
        console.log('Streaming completed');
        res.end();
      } catch (error) {
        Sentry.captureException(error);
        console.error('Error in streaming response:', error);
        res.write(`data: ${JSON.stringify({ error: 'Error generating streaming response' })}\n\n`);
        res.end();
      }
    } else {
      // For non-streaming requests, provide a regular JSON response
      console.log('Sending standard request to OpenAI');
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error from OpenAI:', data);
        throw new Error(data.error?.message || 'Error calling OpenAI API');
      }

      console.log('Response received from OpenAI');
      return res.status(200).json({ 
        message: data.choices[0].message,
        usage: data.usage
      });
    }
  } catch (error) {
    Sentry.captureException(error);
    console.error('Error in AI chat handler:', error);
    return res.status(500).json({ error: 'Failed to generate response' });
  }
}