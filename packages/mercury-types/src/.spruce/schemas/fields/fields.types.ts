import FieldType from './fieldTypeEnum'
import { IField } from '@sprucelabs/schema'

import { IAddressFieldDefinition } from '@sprucelabs/schema'
import { IBooleanFieldDefinition } from '@sprucelabs/schema'
import { IDateFieldDefinition } from '@sprucelabs/schema'
import { IDateTimeFieldDefinition } from '@sprucelabs/schema'
import { IDirectoryFieldDefinition } from '@sprucelabs/schema'
import { IDurationFieldDefinition } from '@sprucelabs/schema'
import { IFileFieldDefinition } from '@sprucelabs/schema'
import { IIdFieldDefinition } from '@sprucelabs/schema'
import { INumberFieldDefinition } from '@sprucelabs/schema'
import { IPhoneFieldDefinition } from '@sprucelabs/schema'
import { IRawFieldDefinition } from '@sprucelabs/schema'
import { ISchemaFieldDefinition, SchemaFieldValueTypeMapper } from '@sprucelabs/schema'
import { ISelectFieldDefinition, SelectFieldValueTypeMapper } from '@sprucelabs/schema'
import { ITextFieldDefinition } from '@sprucelabs/schema'


export type FieldDefinition = | IAddressFieldDefinition| IBooleanFieldDefinition| IDateFieldDefinition| IDateTimeFieldDefinition| IDirectoryFieldDefinition| IDurationFieldDefinition| IFileFieldDefinition| IIdFieldDefinition| INumberFieldDefinition| IPhoneFieldDefinition| IRawFieldDefinition| ISchemaFieldDefinition| ISelectFieldDefinition| ITextFieldDefinition
export type Field = | IField<IAddressFieldDefinition>| IField<IBooleanFieldDefinition>| IField<IDateFieldDefinition>| IField<IDateTimeFieldDefinition>| IField<IDirectoryFieldDefinition>| IField<IDurationFieldDefinition>| IField<IFileFieldDefinition>| IField<IIdFieldDefinition>| IField<INumberFieldDefinition>| IField<IPhoneFieldDefinition>| IField<IRawFieldDefinition>| IField<ISchemaFieldDefinition>| IField<ISelectFieldDefinition>| IField<ITextFieldDefinition>


/** Type for looking up field definitions by field type */
export interface IFieldDefinitionMap {
	[FieldType.Address]: IAddressFieldDefinition
	[FieldType.Boolean]: IBooleanFieldDefinition
	[FieldType.Date]: IDateFieldDefinition
	[FieldType.DateTime]: IDateTimeFieldDefinition
	[FieldType.Directory]: IDirectoryFieldDefinition
	[FieldType.Duration]: IDurationFieldDefinition
	[FieldType.File]: IFileFieldDefinition
	[FieldType.Id]: IIdFieldDefinition
	[FieldType.Number]: INumberFieldDefinition
	[FieldType.Phone]: IPhoneFieldDefinition
	[FieldType.Raw]: IRawFieldDefinition
	[FieldType.Schema]: ISchemaFieldDefinition
	[FieldType.Select]: ISelectFieldDefinition
	[FieldType.Text]: ITextFieldDefinition
}


/** Lookups used for dynamic type mapping based on a definition's field type */
export interface IFieldValueTypeGeneratorMap<F extends FieldDefinition, CreateEntityInstances extends boolean> {
	[FieldType.Address]: IAddressFieldDefinition['value']
	[FieldType.Boolean]: IBooleanFieldDefinition['value']
	[FieldType.Date]: IDateFieldDefinition['value']
	[FieldType.DateTime]: IDateTimeFieldDefinition['value']
	[FieldType.Directory]: IDirectoryFieldDefinition['value']
	[FieldType.Duration]: IDurationFieldDefinition['value']
	[FieldType.File]: IFileFieldDefinition['value']
	[FieldType.Id]: IIdFieldDefinition['value']
	[FieldType.Number]: INumberFieldDefinition['value']
	[FieldType.Phone]: IPhoneFieldDefinition['value']
	[FieldType.Raw]: IRawFieldDefinition['value']
	[FieldType.Schema]: SchemaFieldValueTypeMapper<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateEntityInstances>
	[FieldType.Select]: SelectFieldValueTypeMapper<F extends ISelectFieldDefinition ? F: ISelectFieldDefinition>
	[FieldType.Text]: ITextFieldDefinition['value']
}

/** All field instances */
export interface IFieldMap {
	[FieldType.Address]: IField<IAddressFieldDefinition>
	[FieldType.Boolean]: IField<IBooleanFieldDefinition>
	[FieldType.Date]: IField<IDateFieldDefinition>
	[FieldType.DateTime]: IField<IDateTimeFieldDefinition>
	[FieldType.Directory]: IField<IDirectoryFieldDefinition>
	[FieldType.Duration]: IField<IDurationFieldDefinition>
	[FieldType.File]: IField<IFileFieldDefinition>
	[FieldType.Id]: IField<IIdFieldDefinition>
	[FieldType.Number]: IField<INumberFieldDefinition>
	[FieldType.Phone]: IField<IPhoneFieldDefinition>
	[FieldType.Raw]: IField<IRawFieldDefinition>
	[FieldType.Schema]: IField<ISchemaFieldDefinition>
	[FieldType.Select]: IField<ISelectFieldDefinition>
	[FieldType.Text]: IField<ITextFieldDefinition>
}

