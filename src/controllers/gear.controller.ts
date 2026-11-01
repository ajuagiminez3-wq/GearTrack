import type { Request, Response, NextFunction } from 'express';
import * as GearDAO from '../dao/gear.dao';
import { BadRequest, parseFilters, parseGearInput, parseId } from '../utils/validation';

export async function listGear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const items = await GearDAO.findAll(parseFilters(req.query));
    res.status(200).json(items);
  } catch (error) { next(error); }
}

export async function getGear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id as string);
    const item = await GearDAO.findById(id);
    if (!item) { res.status(404).json({ message: 'Equipment not found.' }); return; }
    res.status(200).json(item);
  } catch (error) { next(error); }
}

export async function createGear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const item = parseGearInput(req.body);
    if (!(await GearDAO.categoryExists(item.categoryId))) throw new BadRequest('Unknown categoryId.');
    const id = await GearDAO.create(item);
    const created = await GearDAO.findById(id);
    res.location(`/api/gear-items/${id}`).status(201).json(created);
  } catch (error) { next(error); }
}

export async function updateGear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id as string);
    const item = parseGearInput(req.body);
    if (!(await GearDAO.categoryExists(item.categoryId))) throw new BadRequest('Unknown categoryId.');
    if (!(await GearDAO.update(id, item))) { res.status(404).json({ message: 'Equipment not found.' }); return; }
    res.status(200).json(await GearDAO.findById(id));
  } catch (error) { next(error); }
}

export async function deleteGear(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params.id as string);
    if (!(await GearDAO.remove(id))) { res.status(404).json({ message: 'Equipment not found.' }); return; }
    res.status(200).json({ message: 'Equipment deleted.', id });
  } catch (error) { next(error); }
}

export async function listCategories(req: Request, res: Response, next: NextFunction): Promise<void> {
  try { res.status(200).json(await GearDAO.findCategories()); }
  catch (error) { next(error); }
}
