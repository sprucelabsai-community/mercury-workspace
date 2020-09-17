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
	['address']: IAddressFieldDefinition
	['boolean']: IBooleanFieldDefinition
	['date']: IDateFieldDefinition
	['dateTime']: IDateTimeFieldDefinition
	['directory']: IDirectoryFieldDefinition
	['duration']: IDurationFieldDefinition
	['file']: IFileFieldDefinition
	['id']: IIdFieldDefinition
	['number']: INumberFieldDefinition
	['phone']: IPhoneFieldDefinition
	['raw']: IRawFieldDefinition
	['schema']: ISchemaFieldDefinition
	['select']: ISelectFieldDefinition
	['text']: ITextFieldDefinition
}


/** Lookups used for dynamic type mapping based on a definition's field type */
export interface IFieldValueTypeGeneratorMap<F extends FieldDefinition, CreateEntityInstances extends boolean> {
	['address']: IAddressFieldDefinition['value']
	['boolean']: IBooleanFieldDefinition['value']
	['date']: IDateFieldDefinition['value']
	['dateTime']: IDateTimeFieldDefinition['value']
	['directory']: IDirectoryFieldDefinition['value']
	['duration']: IDurationFieldDefinition['value']
	['file']: IFileFieldDefinition['value']
	['id']: IIdFieldDefinition['value']
	['number']: INumberFieldDefinition['value']
	['phone']: IPhoneFieldDefinition['value']
	['raw']: IRawFieldDefinition['value']
	['schema']: SchemaFieldValueTypeMapper<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateEntityInstances>
	['select']: SelectFieldValueTypeMapper<F extends ISelectFieldDefinition ? F: ISelectFieldDefinition>
	['text']: ITextFieldDefinition['value']
}

/** All field instances */
export interface IFieldMap {
	['address']: IField<IAddressFieldDefinition>
	['boolean']: IField<IBooleanFieldDefinition>
	['date']: IField<IDateFieldDefinition>
	['dateTime']: IField<IDateTimeFieldDefinition>
	['directory']: IField<IDirectoryFieldDefinition>
	['duration']: IField<IDurationFieldDefinition>
	['file']: IField<IFileFieldDefinition>
	['id']: IField<IIdFieldDefinition>
	['number']: IField<INumberFieldDefinition>
	['phone']: IField<IPhoneFieldDefinition>
	['raw']: IField<IRawFieldDefinition>
	['schema']: IField<ISchemaFieldDefinition>
	['select']: IField<ISelectFieldDefinition>
	['text']: IField<ITextFieldDefinition>
}

