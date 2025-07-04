import BadRequest from "../Error/BadRequest.js";
import Response from "../Models/Response.js";
import * as fileService from "../Services/fileService.js";

export const uploadFile = async (req, res, next) => {
  try {
    const file = req.file;

    if (!file) {
      throw new BadRequest("No file uploaded", "E4002");
    }

    const data = await fileService.uploadFile(req, res);
    const response = new Response();
    response.data = data;
    response.message = "File uploaded successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const getAllFiles = async (req, res, next) => {
  try {
    const data = await fileService.getAllFiles(req, res);
    const response = new Response();
    response.data = data;
    response.message = "All files retrieved successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const updateFileStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    if (!id || !status) {
      throw new BadRequest("Data is missing", "E4002");
    }

    const data = await fileService.updateFileStatus(req, res);
    const response = new Response();
    response.data = data;
    response.message = "File status updated successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const forwardFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id ) {
      throw new BadRequest("File id is missing", "E4002");
    }

    const data = await fileService.forwardFile(req, res);
    const response = new Response();
    response.data = data;
    response.message = "File forwarded successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const reviewFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id ) {
      throw new BadRequest("File id is missing", "E4002");
    }

    const data = await fileService.reviewFile(req, res);
    const response = new Response();
    response.data = data;
    response.message = "File reviewed and re-forwarded successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const deleteFile = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id ) {
      throw new BadRequest("Id is missing", "E4002");
    }

    const data = await fileService.deleteFile(req, res);
    const response = new Response();
    response.data = data;
    response.message = "File deleted successfully";
    response.statusCode = "S001";
    response.success = true;
    res.status(200).json(response);
  } catch (err) {
    return next(err)
  }
};

export const viewFile = async (req, res, next) => {
  try {
    const file = await fileService.viewFile(req, res);

    res.set({
      "Content-Type": file.fileType,
      "Content-Disposition": `inline; filename="${file.fileName}"`,
      "Content-Length": file.fileBuffer.length
    });

    return res.send(file.fileBuffer);
  } catch (err) {
    return next(err)
  }
};