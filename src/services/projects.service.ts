import { RequestHandler } from "express"
import { db } from "../db/sqlite"
import { Project } from "../models/project"

export const getAllProjects = db.prepare("SELECT * FROM projects")

export const getProjectById = db.prepare("SELECT * FROM projects WHERE id = ?")

/*  handlers   */

export const projectService = {
    list: (): Project[] => getAllProjects.all() as Project[],
    
    getById: (id: string): Project => getProjectById.get(id) as Project
}

