/*
 * (c) Copyright Ascensio System SIA 2010-2020
 *
 * This program is a free software product. You can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License (AGPL)
 * version 3 as published by the Free Software Foundation. In accordance with
 * Section 7(a) of the GNU AGPL its Section 15 shall be amended to the effect
 * that Ascensio System SIA expressly excludes the warranty of non-infringement
 * of any third-party rights.
 *
 * This program is distributed WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR  PURPOSE. For
 * details, see the GNU AGPL at: http://www.gnu.org/licenses/agpl-3.0.html
 *
 * You can contact Ascensio System SIA at 20A-12 Ernesta Birznieka-Upisha
 * street, Riga, Latvia, EU, LV-1050.
 *
 * The  interactive user interfaces in modified source and object code versions
 * of the Program must display Appropriate Legal Notices, as required under
 * Section 5 of the GNU AGPL version 3.
 *
 * Pursuant to Section 7(b) of the License you must retain the original Product
 * logo when distributing the program. Pursuant to Section 7(e) we decline to
 * grant you any rights under trademark law for use of our trademarks.
 *
 * All the Product's GUI elements, including illustrations and icon sets, as
 * well as technical writing content are licensed under the terms of the
 * Creative Commons Attribution-ShareAlike 4.0 International. See the License
 * terms at http://creativecommons.org/licenses/by-sa/4.0/legalcode
 *
 */

"use strict";
/**
 * User: Ilja.Kirillov
 * Date: 02.04.2020
 * Time: 15:50
 */

/**
 * Базовый класс для контент контролов
 * @constructor
 */
function CSdtBase()
{}

/**
 * Получаем текст плейсхолдера
 * @returns {string}
 */
CSdtBase.prototype.GetPlaceholderText = function()
{
	var oDocPart = this.GetLogicDocument().GetGlossaryDocument().GetDocPartByName(this.GetPlaceholder());
	if (oDocPart)
	{
		var oFirstParagraph = oDocPart.GetFirstParagraph();
		return oFirstParagraph.GetText();
	}

	return String.fromCharCode(nbsp_charcode, nbsp_charcode, nbsp_charcode, nbsp_charcode);
};
/**
 * Выставляем простой плейсхолдера в виде текста
 * @param {string} sText
 */
CSdtBase.prototype.SetPlaceholderText = function(sText)
{
	var oLogicDocument = this.GetLogicDocument();
	var oGlossary      = oLogicDocument.GetGlossaryDocument();

	var oDocPart = oGlossary.GetDocPartByName(this.GetPlaceholder());
	if (!oDocPart || oGlossary.IsDefaultDocPart(oDocPart))
	{
		var oNewDocPart;
		if (!oDocPart)
			oNewDocPart = oGlossary.CreateDocPart(oGlossary.GetNewName());
		else
			oNewDocPart = oDocPart.Copy(oGlossary.GetNewName());

		this.SetPlaceholder(oNewDocPart.GetDocPartName());
		oDocPart = oNewDocPart;
	}

	oDocPart.RemoveSelection();
	oDocPart.MoveCursorToStartPos();

	var oTextPr = oDocPart.GetDirectTextPr();
	var oParaPr = oDocPart.GetDirectParaPr();

	oDocPart.ClearContent(true);
	oDocPart.SelectAll();

	var oParagraph = oDocPart.GetFirstParagraph();
	oParagraph.CorrectContent();
	oParagraph.SetDirectParaPr(oParaPr);
	oParagraph.SetDirectTextPr(oTextPr);

	oDocPart.AddText(sText);
	oDocPart.RemoveSelection();

	if (this.IsPlaceHolder())
		this.private_FillPlaceholderContent();
};