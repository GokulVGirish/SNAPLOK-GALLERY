"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ProfileInteractors {
    constructor(Repository) {
        this.Repository = Repository;
    }
    async getProfile(userId) {
        try {
            const result = await this.Repository.getProfile(userId);
            if (result)
                return { success: true, message: "Success", user: result };
            return { success: false, message: "Something Went Wrong" };
        }
        catch (error) {
            throw error;
        }
    }
    async updateProfile(userId, name) {
        try {
            const response = await this.Repository.updateProfile(userId, name);
            return response;
        }
        catch (error) {
            throw error;
        }
    }
}
exports.default = ProfileInteractors;
