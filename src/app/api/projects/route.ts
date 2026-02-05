/**
 * API routes for community project proposals.
 * GET: Fetch all projects (with optional difficulty filter)
 * POST: Submit a new project proposal
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProjectsSorted, createProject, getProjectsByDifficulty } from '@/lib/projects-store';
import type { ProjectDifficulty, ProjectSubmission } from '@/types/project';

/**
 * GET /api/projects
 * Fetch all projects, optionally filtered by difficulty
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const difficulty = searchParams.get('difficulty') as ProjectDifficulty | null;

    let projects;

    if (difficulty && ['beginner', 'intermediate', 'advanced'].includes(difficulty)) {
      projects = getProjectsByDifficulty(difficulty);
      // Sort by newest first
      projects.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      projects = getProjectsSorted();
    }

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/projects
 * Submit a new project proposal
 */
export async function POST(request: NextRequest) {
  try {
    const body: ProjectSubmission = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (body.title.length > 100) {
      return NextResponse.json(
        { error: 'Title must be 100 characters or less' },
        { status: 400 }
      );
    }

    if (!body.description || typeof body.description !== 'string' || body.description.trim().length === 0) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    if (body.description.length > 2000) {
      return NextResponse.json(
        { error: 'Description must be 2000 characters or less' },
        { status: 400 }
      );
    }

    if (!body.difficulty || !['beginner', 'intermediate', 'advanced'].includes(body.difficulty)) {
      return NextResponse.json(
        { error: 'Valid difficulty level is required (beginner, intermediate, or advanced)' },
        { status: 400 }
      );
    }

    if (!body.authorName || typeof body.authorName !== 'string' || body.authorName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Author name is required' },
        { status: 400 }
      );
    }

    if (body.authorName.length > 50) {
      return NextResponse.json(
        { error: 'Author name must be 50 characters or less' },
        { status: 400 }
      );
    }

    // Validate skills array
    if (!Array.isArray(body.skills)) {
      return NextResponse.json(
        { error: 'Skills must be an array' },
        { status: 400 }
      );
    }

    // Validate image URL if provided
    if (body.imageUrl && typeof body.imageUrl === 'string' && body.imageUrl.trim().length > 0) {
      try {
        new URL(body.imageUrl);
      } catch {
        return NextResponse.json(
          { error: 'Image URL must be a valid URL' },
          { status: 400 }
        );
      }
    }

    // Create the project
    const project = createProject({
      title: body.title.trim(),
      description: body.description.trim(),
      difficulty: body.difficulty,
      skills: body.skills.map((s) => String(s).trim()).filter((s) => s.length > 0),
      authorName: body.authorName.trim(),
      imageUrl: body.imageUrl?.trim() || undefined,
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
