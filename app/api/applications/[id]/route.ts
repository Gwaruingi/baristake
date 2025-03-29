import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { Application } from "@/models/Application";
import { Job } from "@/models/Job";
import { User } from "@/models/User";
import { Company } from "@/models/Company";
import { Resend } from 'resend';
import { auth } from "@/auth";
import { ensureDbConnected } from "@/lib/mongoose";

// Error handling functions
function handleAuthError(error: Error, message: string) {
  console.error(error.message);
  return NextResponse.json({ error: message }, { status: 401 });
}

function handleValidationError(error: Error, message: string) {
  console.error(error.message);
  return NextResponse.json({ error: message }, { status: 400 });
}

function handleNotFoundError(error: Error, message: string) {
  console.error(error.message);
  return NextResponse.json({ error: message }, { status: 404 });
}

function handlePermissionError(error: Error, message: string) {
  console.error(error.message);
  return NextResponse.json({ error: message }, { status: 403 });
}

// Define interfaces for MongoDB documents
interface JobDocument {
  _id: mongoose.Types.ObjectId;
  title: string;
  companyName: string;
  companyId: mongoose.Types.ObjectId;
  location: string;
  jobType: string;
  status: string;
}

interface ApplicationDocument {
  _id: mongoose.Types.ObjectId;
  jobId: JobDocument;
  userId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  resume?: string;
  cv?: string;
  coverLetter?: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'interview' | 'hired' | 'rejected' | 'accepted';
  notes?: string;
  notificationRead?: boolean;
  statusHistory?: {
    status: string;
    date: Date;
    notes?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

interface RouteParams {
  params: {
    id: string;
  };
}

// Initialize Resend for email notifications - moved inside handlers to avoid build issues
let resend: Resend | null = null;

// GET handler to fetch a specific application
export async function GET(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Ensure database connection
    await ensureDbConnected();
    
    // Get the current session
    const session = await auth();
    
    if (!session?.user) {
      return handleAuthError(
        new Error("Authentication required"),
        "You must be logged in to view application details"
      );
    }
    
    // Validate the application ID
    const { id } = params;
    if (!id) {
      return handleValidationError(
        new Error("Missing application ID"),
        "Application ID is required"
      );
    }
    
    // Fetch the application with job details
    const applicationDoc = await Application.findById(id)
      .populate({
        path: 'jobId',
        model: Job,
        select: 'title companyName companyId location jobType status'
      })
      .lean();
    
    if (!applicationDoc) {
      return handleNotFoundError(
        new Error(`Application with ID ${id} not found`),
        "Application not found"
      );
    }
    
    // Cast to our interface type
    const application = applicationDoc as unknown as ApplicationDocument;
    
    // Check if the user is authorized to view this application
    if (session.user.role === 'jobseeker') {
      // Job seekers can only view their own applications
      if (application.userId.toString() !== session.user.id) {
        return handlePermissionError(
          new Error("Not authorized to view this application"),
          "You do not have permission to view this application"
        );
      }
    } else if (session.user.role === 'company') {
      // Companies can only view applications for their jobs
      const companyId = application.jobId.companyId.toString();
      if (companyId !== session.user.id) {
        return handlePermissionError(
          new Error("Not authorized to view this application"),
          "You do not have permission to view this application"
        );
      }
    } else if (session.user.role !== 'admin') {
      // Admin users can view all applications
      return handlePermissionError(
        new Error("Not authorized to view this application"),
        "You do not have permission to view this application"
      );
    }
    
    return NextResponse.json(application);
  } catch (error: any) {
    console.error("Error fetching application details:", error);
    
    // Check for specific error types
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid application ID format" },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: "Failed to fetch application details" },
      { status: 500 }
    );
  }
}

// PATCH handler to update an application
export async function PATCH(
  request: Request,
  { params }: RouteParams
) {
  try {
    // Ensure database connection
    await ensureDbConnected();
    
    // Get the current session
    const session = await auth();
    
    if (!session?.user) {
      return handleAuthError(
        new Error("Authentication required"),
        "You must be logged in to update application details"
      );
    }
    
    // Get the application ID from params
    const { id } = params;
    
    // Validate the application ID
    if (!id) {
      return handleValidationError(
        new Error("Missing application ID"),
        "Application ID is required"
      );
    }
    
    // Parse the request body
    const updateData = await request.json();
    
    // Fetch the application
    const applicationDoc = await Application.findById(id)
      .populate({
        path: 'jobId',
        model: Job,
        select: 'title companyName companyId'
      })
      .populate({
        path: 'userId',
        model: User,
        select: 'email name role'
      });
    
    if (!applicationDoc) {
      return handleNotFoundError(
        new Error(`Application with ID ${id} not found`),
        "Application not found"
      );
    }
    
    // Cast to our interface type
    const application = applicationDoc as any;
    
    // Check if the user is authorized to update this application
    if (session.user.role === 'jobseeker') {
      // Job seekers can only update their own applications
      if (application.userId._id.toString() !== session.user.id) {
        return handlePermissionError(
          new Error("Not authorized to update this application"),
          "You do not have permission to update this application"
        );
      }
      
      // Job seekers can only update certain fields
      const allowedFields = ['notificationRead'];
      const updateFields: any = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updateFields[field] = updateData[field];
        }
      }
      
      // Save the updated application
      await Application.findByIdAndUpdate(id, updateFields);
      
      return NextResponse.json({
        message: "Application updated successfully",
        application: {
          ...application.toObject(),
          ...updateFields
        }
      });
    } else if (session.user.role === 'company' || session.user.role === 'admin') {
      // Companies can only update applications for their jobs
      if (session.user.role === 'company') {
        const companyId = application.jobId.companyId.toString();
        if (companyId !== session.user.id) {
          return handlePermissionError(
            new Error("Not authorized to update this application"),
            "You do not have permission to update this application"
          );
        }
      }
      
      // Companies and admins can update status, notes, and notificationRead
      const allowedFields = ['status', 'notes', 'notificationRead'];
      const updateFields: any = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          updateFields[field] = updateData[field];
        }
      }
      
      // Add status history entry if status is changing
      if (updateData.status && updateData.status !== application.status) {
        const statusHistoryEntry = {
          status: updateData.status,
          date: new Date(),
          notes: updateData.notes || ''
        };
        
        if (!application.statusHistory) {
          updateFields.statusHistory = [statusHistoryEntry];
        } else {
          updateFields.statusHistory = [...application.statusHistory, statusHistoryEntry];
        }
      }
      
      // Save the updated application
      await Application.findByIdAndUpdate(id, updateFields);
      
      // Send email notification to the applicant if status changed
      if (updateData.status && updateData.status !== application.status && process.env.RESEND_API_KEY) {
        try {
          // Initialize Resend if not already initialized
          if (!resend && process.env.RESEND_API_KEY) {
            resend = new Resend(process.env.RESEND_API_KEY);
          }
          
          const statusMessages = {
            reviewed: "Your application has been reviewed",
            shortlisted: "Congratulations! You've been shortlisted",
            interview: "Great news! You've been selected for an interview",
            hired: "Congratulations! You've been hired",
            rejected: "Thank you for your interest",
            accepted: "Your application has been accepted"
          };
          
          const statusMessage = statusMessages[updateData.status as keyof typeof statusMessages] || 
                               "Your application status has been updated";
          
          if (resend) {
            await resend.emails.send({
              from: 'Job Portal <notifications@jobportal.com>',
              to: application.userId.email,
              subject: `Application Status Update: ${statusMessage}`,
              html: `
                <h1>Application Status Update</h1>
                <p>Dear ${application.userId.name},</p>
                <p>${statusMessage} for the ${application.jobId.title} position at ${application.jobId.companyName}.</p>
                ${updateData.notes ? `<p>Notes: ${updateData.notes}</p>` : ''}
                <p>You can check your application status in your dashboard.</p>
              `
            });
          }
        } catch (emailError) {
          console.error("Failed to send email notification:", emailError);
          // Continue with the response even if email fails
        }
      }
      
      return NextResponse.json({
        message: "Application updated successfully",
        application
      });
    }
    
    // If we get here, the user is not authorized
    return handlePermissionError(
      new Error("Not authorized to update this application"),
      "You do not have permission to update this application"
    );
  } catch (error: any) {
    console.error("Error updating application:", error);
    
    // Check for specific error types
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Invalid application data" },
        { status: 400 }
      );
    }
    
    if (error.name === "CastError") {
      return NextResponse.json(
        { error: "Invalid application ID format" },
        { status: 400 }
      );
    }
    
    // Handle other errors
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}
