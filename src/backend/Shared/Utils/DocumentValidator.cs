using System.Linq;
using BoraLaBackend.Models;

namespace BoraLaBackend.Utils
{
    public static class DocumentValidator
    {
        public static bool GetRoleFromDocument(string document, out Role role)
        {
            role = Role.user;

            if (string.IsNullOrWhiteSpace(document))
            {
                return false;
            }

            string docString = new string(document.Where(char.IsDigit).ToArray());

            if (string.IsNullOrEmpty(docString))
            {
                return false;
            }

            if (docString.Length == 11)
            {
                if (IsValidCpf(docString))
                {
                    role = Role.user;
                    return true;
                }
            }
            else if (docString.Length == 14)
            {
                if (IsValidCnpj(docString))
                {
                    role = Role.organizer;
                    return true;
                }
            }

            return false;
        }

        private static bool IsValidCpf(string cpf)
        {
            if (cpf.Length != 11 || cpf.All(c => c == cpf[0])) return false;

            int[] multiplier1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplier2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            string tempCpf = cpf.Substring(0, 9);
            int sum = 0;

            for (int i = 0; i < 9; i++) sum += int.Parse(tempCpf[i].ToString()) * multiplier1[i];

            int remainder = sum % 11;
            remainder = remainder < 2 ? 0 : 11 - remainder;

            string digit = remainder.ToString();
            tempCpf += digit;
            sum = 0;

            for (int i = 0; i < 10; i++) sum += int.Parse(tempCpf[i].ToString()) * multiplier2[i];

            remainder = sum % 11;
            remainder = remainder < 2 ? 0 : 11 - remainder;

            digit += remainder.ToString();
            return cpf.EndsWith(digit);
        }

        private static bool IsValidCnpj(string cnpj)
        {
            if (cnpj.Length != 14 || cnpj.All(c => c == cnpj[0])) return false;

            int[] multiplier1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplier2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

            string tempCnpj = cnpj.Substring(0, 12);
            int sum = 0;

            for (int i = 0; i < 12; i++) sum += int.Parse(tempCnpj[i].ToString()) * multiplier1[i];

            int remainder = (sum % 11);
            remainder = remainder < 2 ? 0 : 11 - remainder;

            string digit = remainder.ToString();
            tempCnpj += digit;
            sum = 0;

            for (int i = 0; i < 13; i++) sum += int.Parse(tempCnpj[i].ToString()) * multiplier2[i];

            remainder = (sum % 11);
            remainder = remainder < 2 ? 0 : 11 - remainder;

            digit += remainder.ToString();
            return cnpj.EndsWith(digit);
        }
    }
}