"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entries = exports.EntryType = void 0;
const typeorm_1 = require("typeorm");
var EntryType;
(function (EntryType) {
    EntryType["INCOME"] = "income";
    EntryType["EXPENSE"] = "expense";
})(EntryType || (exports.EntryType = EntryType = {}));
let Entries = class Entries {
};
exports.Entries = Entries;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Entries.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Entries.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: EntryType,
    }),
    __metadata("design:type", String)
], Entries.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Entries.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Entries.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", String)
], Entries.prototype, "date", void 0);
exports.Entries = Entries = __decorate([
    (0, typeorm_1.Entity)()
], Entries);
