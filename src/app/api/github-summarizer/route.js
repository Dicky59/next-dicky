import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateRepositorySummary } from '@/lib/chain';

// Function to extract owner and repo from GitHub URL
function parseGitHubUrl(url) {
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = url.match(regex);
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }
  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, '') // Remove .git suffix if present
  };
}

// Function to fetch README.md content from GitHub
async function getReadmeContent(githubUrl) {
  try {
    const { owner, repo } = parseGitHubUrl(githubUrl);
    
    // GitHub API endpoint for repository contents
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'next-dicky-app'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Repository not found or README.md does not exist');
      }
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Decode base64 content
    const readmeContent = Buffer.from(data.content, 'base64').toString('utf-8');
    
    return {
      content: readmeContent,
      name: data.name,
      path: data.path,
      size: data.size,
      downloadUrl: data.download_url
    };
  } catch (error) {
    throw new Error(`Failed to fetch README: ${error.message}`);
  }
}

export async function POST(request) {
  try {
    const { githubUrl } = await request.json();
    // Get API key from x-api-key header
    const apiKey = request.headers.get('x-api-key');

    if (!apiKey) {
      return NextResponse.json(
        { valid: false, message: 'API key is required' },
        { status: 400 }
      );
    }

    // Check if the API key exists in the database
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('*')
      .eq('key', apiKey.trim())
      .single();

    if (error || !data) {
      return NextResponse.json({
        valid: false,
        message: 'Invalid API key'
      }, { status: 401 });
    }

    // Update last_used timestamp
    await supabaseAdmin
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('key', apiKey.trim());

    // API key is valid, proceed with GitHub summarization logic
    if (!githubUrl) {
      return NextResponse.json(
        { valid: true, message: 'GitHub URL is required for summarization' },
        { status: 400 }
      );
    }

    // Get README content and generate summary
    const readmeData = await getReadmeContent(githubUrl);
    const summary = await generateRepositorySummary(readmeData.content);
    
    return NextResponse.json({
      valid: true,
      message: 'GitHub repository summarized successfully',
      user: {
        id: data.id,
        name: data.name || 'API User',
        validatedAt: new Date().toISOString(),
        apiKeyName: data.name,
        description: data.description
      },
      githubUrl: githubUrl,
      readme: {
        name: readmeData.name,
        path: readmeData.path,
        size: readmeData.size
      },
      summary: summary
    });
    
  } catch (error) {
    console.error('Error in GitHub summarizer:', error);
    return NextResponse.json(
      { valid: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
